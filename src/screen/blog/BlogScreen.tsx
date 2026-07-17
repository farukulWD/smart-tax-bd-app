import { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import ScreenHeader from '@/src/components/common/ScreenHeader';
import NoData from '@/src/components/global/NoData';
import BlogCard from '@/src/components/blog/BlogCard';
import { useGetAllBlogsQuery } from '@/src/services/blogApi';
import { navigate } from '@/src/utils/NavigationUtils';

const BlogScreen = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, error, refetch } = useGetAllBlogsQuery({ page });

  const blogs = data?.data ?? [];
  const meta = data?.meta;
  const hasMore = !!meta && meta.page < meta.totalPage;

  const loadMore = () => {
    if (hasMore && !isFetching) {
      setPage(meta.page + 1);
    }
  };

  const handleRefresh = () => {
    if (page === 1) {
      refetch();
    } else {
      setPage(1);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Blog" showBack={false} />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="hsl(125, 70%, 33%)" />
        </View>
      ) : error ? (
        <View className="mx-4">
          <NoData title="Couldn't load blogs" message="Pull down to try again." />
        </View>
      ) : (
        <FlatList
          data={blogs}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <BlogCard item={item} onPress={() => navigate('BlogDetails', { slug: item.slug })} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 12, marginHorizontal: 16 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={<NoData message="No blogs yet." />}
          ListFooterComponent={
            hasMore ? (
              <View className="py-4">
                <ActivityIndicator color="hsl(125, 70%, 33%)" />
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading && page === 1}
              onRefresh={handleRefresh}
              tintColor="hsl(125, 70%, 33%)"
            />
          }
        />
      )}
    </View>
  );
};

export default BlogScreen;
