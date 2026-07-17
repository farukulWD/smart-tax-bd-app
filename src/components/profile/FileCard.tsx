import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { FileText, Trash2, Calendar, Hash, Eye } from 'lucide-react-native';
// import { Pencil } from 'lucide-react-native';
import { IFile } from '@/src/types/filesTypes';
import { getFileType, getExtension, formatDate, shortenId } from '@/src/utils/fileHelpers';

const FILE_STYLES = {
  image: {
    accent: 'border-l-secondary',
    iconBg: 'bg-secondary/10',
    iconColor: 'hsl(131, 56%, 33%)',
    badgeBg: 'bg-secondary/15',
    badgeText: 'text-secondary',
  },
  pdf: {
    accent: 'border-l-destructive',
    iconBg: 'bg-destructive/10',
    iconColor: 'hsl(0, 83%, 49%)',
    badgeBg: 'bg-destructive/15',
    badgeText: 'text-destructive',
  },
  other: {
    accent: 'border-l-warning',
    iconBg: 'bg-warning/10',
    iconColor: 'hsl(38, 92%, 40%)',
    badgeBg: 'bg-warning/15',
    badgeText: 'text-warning',
  },
};

const ACTION_STYLES = [
  { icon: Eye, color: 'hsl(131, 56%, 33%)', textClass: 'text-secondary', label: 'Preview' },
  // { icon: Pencil, color: 'hsl(220, 70%, 50%)', textClass: 'text-[hsl(220,70%,50%)]', label: 'Rename' },
  { icon: Trash2, color: 'hsl(0, 83%, 49%)', textClass: 'text-destructive', label: 'Delete' },
];

const FileCard = ({
  item,
  onPreview,
  onDelete,
  // onRename,
  isDeleting,
}: {
  item: IFile;
  onPreview: () => void;
  onDelete: () => void;
  onRename: () => void;
  isDeleting: boolean;
}) => {
  const fileType = getFileType(item.file);
  const ext = getExtension(item.file);
  const fg = FILE_STYLES[fileType];

  return (
    <View className="mx-4 mb-3 overflow-hidden rounded-2xl border border-border bg-card">
      <View className={`border-l-4 ${fg.accent}`}>
        <View className="flex-row items-center gap-3 p-4 pb-3">
          <View className={`h-14 w-14 items-center justify-center rounded-xl ${fg.iconBg}`}>
            {fileType === 'image' ? (
              <Image source={{ uri: item.file }} className="h-full w-full rounded-xl" resizeMode="cover" />
            ) : (
              <FileText size={24} color={fg.iconColor} />
            )}
          </View>

          <View className="flex-1 gap-1">
            <Text className="text-[15px] font-bold text-cardForeground" numberOfLines={1}>
              {item.name}
            </Text>

            <View className="flex-row items-center gap-2">
              <View className={`rounded-full px-2 py-px ${fg.badgeBg}`}>
                <Text className={`text-[10px] font-bold ${fg.badgeText}`}>
                  {fileType === 'image' ? 'IMG' : fileType === 'pdf' ? 'PDF' : ext}
                </Text>
              </View>
              <Text className="text-xs capitalize text-mutedForeground" numberOfLines={1}>
                {item.type.replace(/_/g, ' ')}
              </Text>
            </View>

            <View className="flex-row items-center gap-3">
              <View className="flex-row items-center gap-1">
                <Calendar size={11} color="hsl(0, 0%, 60%)" />
                <Text className="text-xs text-mutedForeground">{formatDate(item.createdAt)}</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Hash size={11} color="hsl(0, 0%, 60%)" />
                <Text className="text-xs text-mutedForeground">{shortenId(item.orderId)}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="border-t border-border" />

      <View className="flex-row">
        {[onPreview, onDelete].map((handler, i, arr) => {
          const action = ACTION_STYLES[i];
          const isLast = i === arr.length - 1;
          return (
            <TouchableOpacity
              key={action.label}
              onPress={handler}
              disabled={isDeleting && isLast}
              activeOpacity={0.7}
              className={`flex-1 flex-row items-center justify-center gap-2 py-3.5 ${
                !isLast ? 'border-r border-border' : ''
              }`}>
              {isLast && isDeleting ? (
                <ActivityIndicator size="small" color={action.color} />
              ) : (
                <action.icon size={15} color={action.color} />
              )}
              <Text className={`text-xs font-semibold ${action.textClass}`}>
                {isLast && isDeleting ? 'Deleting\u2026' : action.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default FileCard;
