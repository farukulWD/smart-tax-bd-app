import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Eye } from 'lucide-react-native';
import ScreenHeader from '@/src/components/common/ScreenHeader';
import NoData from '@/src/components/global/NoData';
import BlogCard from '@/src/components/blog/BlogCard';
import BlogContent from '@/src/components/blog/BlogContent';
import { AppStackParamList } from '@/src/navigation/AppStack';
import { useGetSingleBlogQuery } from '@/src/services/blogApi';
import { push } from '@/src/utils/NavigationUtils';

type Props = RouteProp<AppStackParamList, 'BlogDetails'>;

const BlogDetailsScreen = () => {
  const route = useRoute<Props>();
  const { slug } = route.params;

  const { data, isLoading, error } = useGetSingleBlogQuery(slug);

  const blog = data?.data?.blog;
  const related = data?.data?.related ?? [];

  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader title="Blog" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="hsl(125, 70%, 33%)" />
        </View>
      </View>
    );
  }

  if (error || !blog) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader title="Blog" />
        <View className="mx-4 mt-4">
          <NoData
            title="Article not available"
            message="This post may have been removed or unpublished."
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Blog" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}>
        {!!blog.coverImage && (
          <Image source={{ uri: blog.coverImage }} className="h-56 w-full" resizeMode="cover" />
        )}

        <View className="px-4 pt-4">
          <View className="flex-row">
            <View className="bg-primary/15 rounded-full px-2.5 py-1">
              <Text className="text-[11px] font-bold capitalize text-primary">{blog.category}</Text>
            </View>
          </View>

          <Text className="mt-3 text-2xl font-bold leading-8 text-foreground">{blog.title}</Text>

          <View className="mt-2 flex-row items-center justify-between border-b border-border pb-3">
            <Text className="text-xs text-mutedForeground">
              {blog.authorName} ·{' '}
              {dayjs(blog.publishedAt ?? blog.createdAt).format('MMM DD, YYYY')}
            </Text>
            <View className="flex-row items-center gap-1">
              <Eye size={12} color="hsl(0, 0%, 60%)" />
              <Text className="text-[11px] text-mutedForeground">{blog.views}</Text>
            </View>
          </View>

          <View className="mt-3">
            <BlogContent content={blog.content} />
          </View>

          {blog.tags.length > 0 && (
            <View className="mt-4 flex-row flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <View key={tag} className="rounded-full bg-muted px-2.5 py-1">
                  <Text className="text-[11px] text-mutedForeground">#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {related.length > 0 && (
          <View className="mt-6">
            <Text className="mb-3 px-4 text-base font-bold text-foreground">Related posts</Text>
            <FlatList
              data={related}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              renderItem={({ item }) => (
                <BlogCard
                  item={item}
                  compact
                  onPress={() => push('BlogDetails', { slug: item.slug })}
                />
              )}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default BlogDetailsScreen;
