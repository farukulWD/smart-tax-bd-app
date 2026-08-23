import { isImageUrl, isPdfUrl } from '@/src/utils/commonFunction';
import { AlertCircle, Eye, FileText, Upload, X } from 'lucide-react-native';
import { ActivityIndicator, Image, TouchableOpacity, View } from 'react-native';
import AppText from '@/src/components/common/AppText';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/src/theme/useThemeColors';

const DocumentCard = ({
  doc,
  file,
  isUploading,
  isActive,
  onPress,
  onView,
  onReplace,
  localPreview,
}: {
  doc: string;
  file: any;
  isUploading: boolean;
  isActive?: boolean;
  onPress: () => void;
  onView: () => void;
  onReplace?: () => void;
  localPreview?: { uri: string; name: string; isImage: boolean } | null;
}) => {
  const { t } = useTranslation();
  const { colors } = useThemeColors();
  const fileUrl = file?.file;
  const pending = !!localPreview;
  const uploaded = !!file || pending;
  const isImg = !!file && isImageUrl(fileUrl);
  const isPdf = !!file && isPdfUrl(fileUrl);

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
      <View className="roundcard mb-2 flex-1 items-center justify-center overflow-hidden bg-muted/50">
        {pending ? (
          <View className="h-full w-full items-center justify-center">
            {localPreview.isImage ? (
              <Image
                source={{ uri: localPreview.uri }}
                className="h-full w-full"
                resizeMode="contain"
              />
            ) : (
              <View className="items-center gap-1">
                <FileText size={32} color={colors.mutedForeground} />
                <AppText className="text-center text-xs text-foreground" numberOfLines={2}>
                  {localPreview.name}
                </AppText>
              </View>
            )}
            {isUploading && isActive && (
              <View className="absolute inset-0 items-center justify-center bg-background/50">
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )}
          </View>
        ) : isUploading && isActive ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : file ? (
          isImg ? (
            <Image source={{ uri: fileUrl }} className="h-full w-full" resizeMode="contain" />
          ) : isPdf ? (
            <View className="items-center gap-1">
              <FileText size={32} color={colors.destructive} />
              <AppText className="text-center text-xs text-foreground" numberOfLines={2}>
                {file?.name || t('common.docDefault')}
              </AppText>
            </View>
          ) : (
            <View className="items-center gap-1">
              <FileText size={28} color={colors.mutedForeground} />
              <AppText className="text-xs text-mutedForeground">{t('common.fileUploaded')}</AppText>
            </View>
          )
        ) : (
          <View className="items-center gap-1">
            <AlertCircle size={28} color={colors.warning} />
            <AppText className="text-xs text-warning">{t('common.noFileYet')}</AppText>
          </View>
        )}
      </View>

      {/* Label */}
      <AppText
        className="mb-0.5 text-center text-sm font-semibold text-foreground"
        numberOfLines={1}>
        {doc}
      </AppText>
      <AppText className="mb-2 text-center text-xs text-mutedForeground">
        {uploaded ? t('common.tapToReplace') : t('common.tapToUpload')}
      </AppText>

      {/* Status / View button */}
      {pending ? (
        <View className="flex-row items-center justify-center gap-1 rounded-lg bg-primary/10 py-1.5">
          <ActivityIndicator size="small" color={colors.primary} />
          <AppText className="text-xs font-semibold text-primary">{t('common.uploading')}</AppText>
        </View>
      ) : file ? (
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation?.();
            onView();
          }}
          className="flex-row items-center justify-center gap-1 rounded-lg bg-success/10 py-1.5">
          <Eye size={14} color={colors.success} />
          <AppText className="text-xs font-semibold text-success">{t('common.view')}</AppText>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation?.();
            onPress();
          }}
          className="flex-row items-center justify-center gap-1 rounded-lg bg-warning/20 py-1.5">
          <Upload size={14} color={colors.warning} />
          <AppText className="text-xs font-semibold text-warning">{t('common.upload')}</AppText>
        </TouchableOpacity>
      )}

      {/* Replace badge — hints the card can be tapped to swap the file */}
      {!!file && !pending && (
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation?.();
            (onReplace ?? onPress)();
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={t('common.tapToReplace')}
          className="absolute right-2 top-2 rounded-full bg-foreground/60 p-1"
          style={{ zIndex: 10 }}>
          <X size={14} color={colors.card} />
        </TouchableOpacity>
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
