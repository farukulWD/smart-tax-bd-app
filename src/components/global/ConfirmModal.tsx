import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { AlertTriangle, Trash2 } from 'lucide-react-native';

export interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive,
  isLoading,
  icon,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  const confirmedRef = useRef(false);

  useEffect(() => {
    if (visible) confirmedRef.current = false;
  }, [visible]);

  const handleConfirm = () => {
    if (confirmedRef.current || isLoading) return;
    confirmedRef.current = true;
    onConfirm();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onCancel}>
      <Pressable className="flex-1 justify-center bg-black/50 px-6" onPress={onCancel}>
        <Pressable
          className="rounded-3xl border border-border bg-card p-6"
          onPress={() => {}}>
          {icon ?? (
            <View
              className={`mb-4 h-12 w-12 items-center justify-center rounded-full ${
                destructive ? 'bg-destructive/15' : 'bg-primary/15'
              }`}>
              {destructive ? (
                <Trash2 size={22} color="hsl(0, 83%, 49%)" />
              ) : (
                <AlertTriangle size={22} color="hsl(38, 92%, 50%)" />
              )}
            </View>
          )}

          <Text className="mb-2 text-lg font-bold text-foreground">{title}</Text>

          {message && (
            <Text className="mb-6 text-sm leading-5 text-mutedForeground">{message}</Text>
          )}

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onCancel}
              disabled={isLoading}
              className="flex-1 items-center rounded-2xl border border-border bg-muted py-3.5">
              <Text className="text-sm font-semibold text-foreground">{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={isLoading}
              className={`flex-1 flex-row items-center justify-center gap-2 rounded-2xl py-3.5 ${
                destructive
                  ? isLoading
                    ? 'bg-destructive/50'
                    : 'bg-destructive'
                  : isLoading
                    ? 'bg-primary/50'
                    : 'bg-primary'
              }`}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-sm font-bold text-primaryForeground">{confirmLabel}</Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ConfirmModal;
