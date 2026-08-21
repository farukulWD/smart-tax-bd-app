import { View, Image, Pressable } from 'react-native';
import AppText from '@/src/components/common/AppText';
import dayjs from 'dayjs';
import { Eye } from 'lucide-react-native';
import { BlogListItem } from '@/src/types/blogTypes';

type BlogCardProps = {
  item: BlogListItem;
  onPress: () => void;
  compact?: boolean; // horizontal related-posts row
};

const BlogCard = ({ item, onPress, compact = false }: BlogCardProps) => (
  <Pressable
    onPress={onPress}
    className={[
      'mb-3 overflow-hidden rounded-2xl border border-border bg-card',
      compact ? 'mr-3 w-64' : '',
    ].join(' ')}>
    {!!item.coverImage && (
      <Image
        source={{ uri: item.coverImage }}
        className={compact ? 'h-28 w-full' : 'h-44 w-full'}
        resizeMode="cover"
      />
    )}

    <View className="px-3 py-3">
      <View className="flex-row">
        <View className="rounded-full bg-primary/15 px-2.5 py-1">
          <AppText className="text-[11px] font-bold capitalize text-primary">
            {item.category}
          </AppText>
        </View>
      </View>

      <AppText className="mt-2 font-bold leading-5 text-foreground" numberOfLines={2}>
        {item.title}
      </AppText>

      {!!item.excerpt && (
        <AppText
          className="mt-1 text-xs leading-5 text-mutedForeground"
          numberOfLines={compact ? 2 : 3}>
          {item.excerpt}
        </AppText>
      )}

      <View className="mt-3 flex-row items-center justify-between">
        <AppText className="text-[11px] text-mutedForeground">
          {item.authorName} · {dayjs(item.publishedAt ?? item.createdAt).format('MMM DD, YYYY')}
        </AppText>
        <View className="flex-row items-center gap-1">
          <Eye size={12} color="hsl(0, 0%, 60%)" />
          <AppText className="text-[11px] text-mutedForeground">{item.views}</AppText>
        </View>
      </View>
    </View>
  </Pressable>
);

export default BlogCard;
