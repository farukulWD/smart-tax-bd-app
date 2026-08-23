import { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import AppText from '@/src/components/common/AppText';

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
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 justify-center bg-black/50 px-6" onPress={onClose}>
        <Pressable className="rounded-3xl border border-border bg-card p-6" onPress={() => {}}>
          <AppText className="mb-1 text-lg font-bold text-foreground">Rename File</AppText>
          <AppText className="mb-4 text-sm text-mutedForeground">
            Enter a new name for this file.
          </AppText>

          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder="File name"
            placeholderTextColor="hsl(0, 0%, 60%)"
            autoFocus
            className="mb-5 h-10 rounded-xl border border-border bg-background px-4 text-sm text-foreground"
            autoComplete="off"
            autoCorrect={false}
            spellCheck={false}
            textContentType="none"
            importantForAutofill="no"
          />

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              disabled={isUpdating}
              className="h-10 flex-1 items-center justify-center rounded-2xl border border-border bg-muted">
              <AppText className="text-sm font-semibold text-foreground">Cancel</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onSave(value.trim())}
              disabled={isUpdating || !value.trim() || value.trim() === currentName}
              className={`h-10 flex-1 items-center justify-center rounded-2xl ${
                isUpdating || !value.trim() || value.trim() === currentName
                  ? 'bg-primary/50'
                  : 'bg-primary'
              }`}>
              {isUpdating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <AppText className="text-sm font-bold text-primaryForeground">Save</AppText>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default RenameModal;
