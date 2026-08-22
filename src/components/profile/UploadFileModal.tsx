import { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import AppText from '@/src/components/common/AppText';
import * as DocumentPicker from 'expo-document-picker';
import { Upload, FileText } from 'lucide-react-native';

const DOCUMENT_TYPES = [
  { label: 'TIN', value: 'tin' },
  { label: 'BIN', value: 'bin' },
  { label: 'Trade License', value: 'trade_license' },
  { label: 'NID', value: 'nid' },
  { label: 'Passport', value: 'passport' },
  { label: 'Other', value: 'other' },
];

interface UploadFileModalProps {
  visible: boolean;
  isUploading: boolean;
  onClose: () => void;
  onUpload: (data: {
    name: string;
    type: string;
    asset: { uri: string; name: string; mimeType?: string };
  }) => Promise<void>;
}

const UploadFileModal = ({ visible, isUploading, onClose, onUpload }: UploadFileModalProps) => {
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<DocumentPicker.DocumentPickerAsset | null>(
    null
  );
  const [typeOpen, setTypeOpen] = useState(false);

  useEffect(() => {
    if (visible) {
      setName('');
      setSelectedType('');
      setSelectedAsset(null);
      setTypeOpen(false);
    }
  }, [visible]);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets?.[0]) {
        setSelectedAsset(result.assets[0]);
      }
    } catch {
      /* ignore */
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !selectedType || !selectedAsset) return;
    await onUpload({
      name: name.trim(),
      type: selectedType,
      asset: {
        uri: selectedAsset.uri,
        name: selectedAsset.name,
        mimeType: selectedAsset.mimeType,
      },
    });
  };

  const handleClose = () => {
    if (isUploading) return;
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={handleClose}>
      <Pressable className="flex-1 justify-center bg-black/50 px-6" onPress={handleClose}>
        <Pressable
          className="rounded-3xl border border-border bg-card p-6"
          onPress={() => setTypeOpen(false)}>
          <AppText className="mb-1 text-lg font-bold text-foreground">Upload File</AppText>
          <AppText className="mb-4 text-sm text-mutedForeground">
            Upload your documents here. Click save when you're done.
          </AppText>

          <AppText className="mb-1.5 text-sm font-semibold text-foreground">Name</AppText>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. TIN Certificate"
            placeholderTextColor="hsl(0, 0%, 60%)"
            className="mb-4 h-10 rounded-xl border border-border bg-background px-4 text-sm text-foreground"
          />

          <AppText className="mb-1.5 text-sm font-semibold text-foreground">Type</AppText>
          <View className="relative mb-4">
            <Pressable
              className="h-10 flex-row items-center justify-between rounded-xl border border-border bg-muted px-4"
              onPress={() => setTypeOpen((p) => !p)}>
              <AppText
                className={`text-sm ${selectedType ? 'text-foreground' : 'text-mutedForeground'}`}>
                {selectedType
                  ? DOCUMENT_TYPES.find((t) => t.value === selectedType)?.label
                  : 'Select type'}
              </AppText>
              <AppText className="text-[11px] text-foreground">{typeOpen ? '▲' : '▼'}</AppText>
            </Pressable>
            {typeOpen && (
              <View className="z-50 mt-1 overflow-hidden rounded-xl border border-border bg-muted shadow-md">
                <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
                  {DOCUMENT_TYPES.map((type) => (
                    <Pressable
                      key={type.value}
                      className={`px-4 py-3 ${
                        type.value === selectedType ? 'border-b border-b-border bg-card' : ''
                      }`}
                      onPress={() => {
                        setSelectedType(type.value);
                        setTypeOpen(false);
                      }}>
                      <AppText
                        className={`text-sm ${
                          type.value === selectedType
                            ? 'font-semibold text-success'
                            : 'text-mutedForeground'
                        }`}>
                        {type.label}
                      </AppText>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <AppText className="mb-1.5 text-sm font-semibold text-foreground">File</AppText>
          <TouchableOpacity
            onPress={handlePickFile}
            className="mb-5 h-10 flex-row items-center gap-3 rounded-xl border border-border bg-background px-4">
            <FileText size={18} color="hsl(0, 0%, 60%)" />
            <AppText
              className={`flex-1 text-sm ${
                selectedAsset ? 'text-foreground' : 'text-mutedForeground'
              }`}>
              {selectedAsset ? selectedAsset.name : 'No file chosen'}
            </AppText>
            <Upload size={16} color="hsl(125, 70%, 33%)" />
          </TouchableOpacity>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handleClose}
              disabled={isUploading}
              className="h-10 flex-1 items-center justify-center rounded-2xl border border-border bg-muted">
              <AppText className="text-sm font-semibold text-foreground">Cancel</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isUploading || !name.trim() || !selectedType || !selectedAsset}
              className={`h-10 flex-1 items-center justify-center rounded-2xl ${
                isUploading || !name.trim() || !selectedType || !selectedAsset
                  ? 'bg-primary/50'
                  : 'bg-primary'
              }`}>
              {isUploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <AppText className="text-sm font-bold text-primaryForeground">Upload</AppText>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default UploadFileModal;
