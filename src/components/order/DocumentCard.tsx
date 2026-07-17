import { isImageUrl, isPdfUrl } from '@/src/utils/commonFunction';
import { AlertCircle, Eye, FileText } from 'lucide-react-native';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/src/theme/useThemeColors';

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
  isActive?: boolean;
  onPress: () => void;
  onView: () => void;
}) => {
  const { t } = useTranslation();
  const { colors } = useThemeColors();
  const fileUrl = file?.file;
  const uploaded = !!file;
  const isImg = uploaded && isImageUrl(fileUrl);
  const isPdf = uploaded && isPdfUrl(fileUrl);

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      className={[
        'h-52 justify-between rounded-2xl border p-3',
        uploaded ? 'border-border bg-card' : 'border-warning/30 bg-warning/10',
      ].join(' ')}
      style={{ flex: 1, margin: 6, minWidth: 140, maxWidth: '48%' }}>
      {/* Thumbnail area */}
      <View className="bg-muted/50 roundcard mb-2 flex-1 items-center justify-center overflow-hidden">
        {isUploading && isActive ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : uploaded ? (
          isImg ? (
            <Image source={{ uri: fileUrl }} className="h-full w-full" resizeMode="contain" />
          ) : isPdf ? (
            <View className="items-center gap-1">
              <FileText size={32} color={colors.destructive} />
              <Text className="text-center text-xs text-foreground" numberOfLines={2}>
                {file?.name || t('common.docDefault')}
              </Text>
            </View>
          ) : (
            <View className="items-center gap-1">
              <FileText size={28} color={colors.mutedForeground} />
              <Text className="text-xs text-mutedForeground">{t('common.fileUploaded')}</Text>
            </View>
          )
        ) : (
          <View className="items-center gap-1">
            <AlertCircle size={28} color={colors.warning} />
            <Text className="text-xs text-warning">{t('common.noFileYet')}</Text>
          </View>
        )}
      </View>

      {/* Label */}
      <Text className="mb-0.5 text-sm font-semibold text-foreground" numberOfLines={1}>
        {doc}
      </Text>
      <Text className="mb-2 text-xs text-mutedForeground">
        {uploaded ? t('common.tapToReplace') : t('common.tapToUpload')}
      </Text>

      {/* Status / View button */}
      {uploaded ? (
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation?.();
            onView();
          }}
          className="flex-row items-center justify-center gap-1 rounded-lg bg-success/10 py-1.5">
          <Eye size={14} color={colors.success} />
          <Text className="text-xs font-semibold text-success">{t('common.view')}</Text>
        </TouchableOpacity>
      ) : (
        <View className="items-center rounded-full bg-warning/20 py-1.5">
          <Text className="text-xs font-semibold text-warning">{t('common.missing')}</Text>
        </View>
      )}

      {/* Active ring overlay */}
      {isActive && (
        <View
          pointerEvents="none"
          className="absolute inset-0 rounded-2xl border-2 border-primary"
        />
      )}
    </TouchableOpacity>
  );
};

export default DocumentCard;
