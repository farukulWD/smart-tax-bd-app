import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Camera, FileUp, X } from 'lucide-react-native';

type Props = {
  visible: boolean;
  doc: string;
  onPickFromFiles: () => void;
  onTakePhoto: () => void;
  onCancel: () => void;
};

const UploadOptionModal = ({
  visible,
  doc,
  onPickFromFiles,
  onTakePhoto,
  onCancel,
}: Props) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onCancel}>
    <View className="flex-1 justify-end bg-black/50">
      <View className="rounded-t-3xl bg-card px-6 pb-10 pt-6 shadow-lg">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-foreground" numberOfLines={1}>
            {doc}
          </Text>
          <TouchableOpacity onPress={onCancel} className="rounded-full bg-muted p-2">
            <X size={18} color="hsl(0, 0%, 60%)" />
          </TouchableOpacity>
        </View>
        <Text className="mb-6 text-sm text-mutedForeground">
          Choose how you want to upload this document.
        </Text>

        <TouchableOpacity
          onPress={onPickFromFiles}
          activeOpacity={0.8}
          className="mb-3 flex-row items-center gap-4 rounded-2xl border border-border bg-muted px-5 py-4">
          <View className="rounded-xl bg-primary/15 p-3">
            <FileUp size={22} color="hsl(125, 70%, 33%)" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-foreground">Choose from Files</Text>
            <Text className="mt-0.5 text-xs text-mutedForeground">
              Select an image or PDF from your device
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onTakePhoto}
          activeOpacity={0.8}
          className="flex-row items-center gap-4 rounded-2xl border border-border bg-muted px-5 py-4">
          <View className="rounded-xl bg-destructive/15 p-3">
            <Camera size={22} color="hsl(0, 83%, 49%)" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-foreground">Take Photo</Text>
            <Text className="mt-0.5 text-xs text-mutedForeground">
              Capture a photo using your camera
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default UploadOptionModal;
