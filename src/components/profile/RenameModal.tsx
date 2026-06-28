import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';

const RenameModal = ({
  visible,
  currentName,
  isUpdating,
  onClose,
  onSave,
}: {
  visible: boolean;
  currentName: string;
  isUpdating: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
}) => {
  const [value, setValue] = useState(currentName);

  useEffect(() => {
    if (visible) setValue(currentName);
  }, [visible, currentName]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}>
      <Pressable className="flex-1 justify-center bg-black/50 px-6" onPress={onClose}>
        <Pressable
          className="rounded-3xl border border-border bg-card p-6"
          onPress={() => {}}>
          <Text className="mb-1 text-lg font-bold text-foreground">Rename File</Text>
          <Text className="mb-4 text-sm text-mutedForeground">
            Enter a new name for this file.
          </Text>

          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder="File name"
            placeholderTextColor="hsl(0, 0%, 60%)"
            autoFocus
            className="mb-5 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground"
          />

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              disabled={isUpdating}
              className="flex-1 items-center rounded-2xl border border-border bg-muted py-3.5">
              <Text className="text-sm font-semibold text-foreground">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onSave(value.trim())}
              disabled={isUpdating || !value.trim() || value.trim() === currentName}
              className={`flex-1 items-center rounded-2xl py-3.5 ${
                isUpdating || !value.trim() || value.trim() === currentName
                  ? 'bg-primary/50'
                  : 'bg-primary'
              }`}>
              {isUpdating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-sm font-bold text-primaryForeground">Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default RenameModal;
