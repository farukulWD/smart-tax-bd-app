import { isImageUrl, isPdfUrl } from '@/src/utils/commonFunction';
import { AlertCircle, Eye, FileText } from 'lucide-react-native';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';

const DocumentCard = ({
  doc,
  file,
  isUploading,
  isActive,
  onPress,
  onView,
}: {
  doc: string;
  file: any;
  isUploading: boolean;
  isActive: boolean;
  onPress: () => void;
  onView: () => void;
}) => {
  const fileUrl = file?.file;
  const uploaded = !!file;
  const isImg = uploaded && isImageUrl(fileUrl);
  const isPdf = uploaded && isPdfUrl(fileUrl);

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      className={[
        'flex aspect-square flex-col justify-between rounded-2xl border p-3',
        uploaded ? 'border-border bg-card' : 'border-amber-200 bg-amber-50',
        isActive ? 'ring-2 ring-indigo-500' : '',
      ].join(' ')}
      style={{ flex: 1, margin: 6, minWidth: 140, maxWidth: '48%' }}>
      {/* Thumbnail area */}
      <View className="bg-muted/50 roundcard mb-2 flex-1 items-center justify-center overflow-hidden">
        {isUploading && isActive ? (
          <ActivityIndicator size="large" color="#6366f1" />
        ) : uploaded ? (
          isImg ? (
            <Image source={{ uri: fileUrl }} className="h-full w-full" resizeMode="contain" />
          ) : isPdf ? (
            <View className="items-center gap-1">
              <FileText size={32} color="#ef4444" />
              <Text className="text-center text-xs text-foreground" numberOfLines={2}>
                {file?.name || 'Document'}
              </Text>
            </View>
          ) : (
            <View className="items-center gap-1">
              <FileText size={28} color="#6b7280" />
              <Text className="text-xs text-mutedForeground">File uploaded</Text>
            </View>
          )
        ) : (
          <View className="items-center gap-1">
            <AlertCircle size={28} color="#f59e0b" />
            <Text className="text-xs text-amber-600">No file yet</Text>
          </View>
        )}
      </View>

      {/* Label */}
      <Text className="mb-0.5 text-sm font-semibold text-foreground" numberOfLines={1}>
        {doc}
      </Text>
      <Text className="mb-2 text-xs text-mutedForeground">
        {uploaded ? 'Tap to replace' : 'Tap to upload'}
      </Text>

      {/* Status / View button */}
      {uploaded ? (
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation?.();
            onView();
          }}
          className="flex-row items-center justify-center gap-1 rounded-lg bg-green-200/10 py-1.5">
          <Eye size={14} color="#16a34a" />
          <Text className="text-xs font-semibold text-green-700">View</Text>
        </TouchableOpacity>
      ) : (
        <View className="items-center rounded-lg bg-amber-100 py-1.5">
          <Text className="text-xs font-semibold text-amber-600">Missing</Text>
        </View>
      )}

      {/* Active ring overlay */}
      {isActive && (
        <View
          pointerEvents="none"
          className="absolute inset-0 rounded-2xl border-2 border-indigo-500"
        />
      )}
    </TouchableOpacity>
  );
};

export default DocumentCard;
