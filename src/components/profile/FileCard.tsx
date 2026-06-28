import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  FileText,
  Pencil,
  Trash2,
  Eye,
  Calendar,
  Hash,
  Tag,
} from 'lucide-react-native';
import { IFile } from '@/src/types/filesTypes';
import { getFileType, getExtension, formatDate, shortenId } from '@/src/utils/fileHelpers';

const FileCard = ({
  item,
  onPreview,
  onDelete,
  onRename,
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

  return (
    <View className="mx-4 mb-3 overflow-hidden rounded-2xl border border-border bg-card">
      <View className="flex-row">
        <View className="h-20 w-20 flex-shrink-0 items-center justify-center bg-muted">
          {fileType === 'image' ? (
            <Image source={{ uri: item.file }} className="h-full w-full" resizeMode="cover" />
          ) : fileType === 'pdf' ? (
            <View className="items-center gap-1">
              <FileText size={26} color="hsl(0, 83%, 49%)" />
              <Text className="text-[10px] font-bold text-destructive">PDF</Text>
            </View>
          ) : (
            <View className="items-center gap-1">
              <FileText size={26} color="hsl(0, 0%, 60%)" />
              <Text className="text-[10px] font-bold text-mutedForeground">{ext}</Text>
            </View>
          )}
        </View>

        <View className="flex-1 justify-center px-3 py-3">
          <Text className="mb-0.5 text-sm font-bold text-cardForeground" numberOfLines={1}>
            {item.name}
          </Text>
          <View className="mb-1 flex-row items-center gap-1">
            <Tag size={11} color="hsl(0, 0%, 60%)" />
            <Text className="text-xs text-mutedForeground" numberOfLines={1}>
              {item.type}
            </Text>
          </View>
          <View className="mb-1 flex-row items-center gap-1">
            <Calendar size={11} color="hsl(0, 0%, 60%)" />
            <Text className="text-xs text-mutedForeground">{formatDate(item.createdAt)}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Hash size={11} color="hsl(0, 0%, 60%)" />
            <Text className="text-xs text-mutedForeground">Order {shortenId(item.orderId)}</Text>
          </View>
        </View>

        <View className="pr-3 pt-3">
          <View
            className={`rounded-lg px-2 py-0.5 ${
              fileType === 'image'
                ? 'bg-primary/15'
                : fileType === 'pdf'
                  ? 'bg-destructive/15'
                  : 'bg-muted'
            }`}>
            <Text
              className={`text-[10px] font-bold ${
                fileType === 'image'
                  ? 'text-primary'
                  : fileType === 'pdf'
                    ? 'text-destructive'
                    : 'text-mutedForeground'
              }`}>
              {fileType === 'image' ? 'IMG' : fileType === 'pdf' ? 'PDF' : ext}
            </Text>
          </View>
        </View>
      </View>

      <View className="border-t border-border" />

      <View className="flex-row">
        <TouchableOpacity
          onPress={onPreview}
          activeOpacity={0.75}
          className="flex-1 flex-row items-center justify-center gap-2 border-r border-border py-3">
          <Eye size={15} color="hsl(125, 70%, 33%)" />
          <Text className="text-xs font-semibold text-primary">Preview</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onRename}
          activeOpacity={0.75}
          className="flex-1 flex-row items-center justify-center gap-2 border-r border-border py-3">
          <Pencil size={15} color="hsl(220, 70%, 50%)" />
          <Text className="text-xs font-semibold text-[hsl(220,70%,50%)]">Rename</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDelete}
          disabled={isDeleting}
          activeOpacity={0.75}
          className="flex-1 flex-row items-center justify-center gap-2 py-3">
          {isDeleting ? (
            <ActivityIndicator size="small" color="hsl(0, 83%, 49%)" />
          ) : (
            <Trash2 size={15} color="hsl(0, 83%, 49%)" />
          )}
          <Text className="text-xs font-semibold text-destructive">
            {isDeleting ? 'Deleting\u2026' : 'Delete'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FileCard;
