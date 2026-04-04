// ─── sub-components ──────────────────────────────────────────────────────────

import { PreviewFile } from '@/src/types/commonTypes';
import { Download, FileText, X } from 'lucide-react-native';
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ─── Preview Modal ────────────────────────────────────────────────────────────

const PreviewModal = ({
  visible,
  file,
  onClose,
  onDownload,
  isDownloading,
}: {
  visible: boolean;
  file: PreviewFile | null;
  onClose: () => void;
  onDownload: () => void;
  isDownloading: boolean;
}) => {
  if (!file) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View className="flex-1 bg-card">
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-border px-4 pb-3 pt-5">
          <View className="mr-3 flex-1">
            <Text className="text-base font-bold text-foreground" numberOfLines={1}>
              {file.name || 'Preview'}
            </Text>
            <Text className="mt-0.5 text-xs text-mutedForeground">
              {file.type === 'image' && 'Preview the image below'}
              {file.type === 'pdf' && 'PDF document'}
              {file.type === 'other' && 'Download to view this file'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="h-9 w-9 items-center justify-center rounded-full bg-destructive">
            <X size={18} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="m-4 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-gray-50">
          {file.type === 'image' ? (
            <Image source={{ uri: file.url }} className="h-full w-full" resizeMode="contain" />
          ) : file.type === 'pdf' ? (
            <View className="items-center gap-4 p-6">
              <FileText size={56} color="#ef4444" />
              <Text className="text-center text-sm text-mutedForeground">
                PDF preview is not supported in-app.
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL(file.url)}
                className="rounded-xl bg-indigo-600 px-5 py-3">
                <Text className="text-sm font-semibold text-white">Open PDF in Browser</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="items-center gap-3 p-6">
              <FileText size={48} color="#9ca3af" />
              <Text className="text-center text-sm text-mutedForeground">
                Preview not available.{'\n'}Download to view.
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View className="flex-row gap-3 px-4 pb-8 pt-2">
          <TouchableOpacity
            onPress={onClose}
            className="flex-1 items-center rounded-xl border border-gray-200 py-3">
            <Text className="text-sm font-semibold text-gray-600">Close</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDownload}
            disabled={isDownloading}
            className={[
              'flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3',
              isDownloading ? 'bg-indigo-300' : 'bg-indigo-600',
            ].join(' ')}>
            {isDownloading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Download size={16} color="#fff" />
            )}
            <Text className="text-sm font-semibold text-white">
              {isDownloading ? 'Downloading…' : 'Download'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PreviewModal;
