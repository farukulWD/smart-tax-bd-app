import FaqItem from '@/src/components/faq/FaqItem';
import { ActivityIndicator, View, FlatList, RefreshControl } from 'react-native';
import ScreenHeader from '@/src/components/common/ScreenHeader';
import NoData from '@/src/components/global/NoData';
import { useGetAllFaqsQuery } from '@/src/services/publicApi';

const FAQScreen = () => {
  const { data, isLoading, isFetching, error, refetch } = useGetAllFaqsQuery();

  const faqs = data?.data ?? [];

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="FAQ" />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="hsl(125, 70%, 33%)" />
        </View>
      ) : error ? (
        <View className="mx-4">
          <NoData title="Couldn't load FAQs" message="Pull down to try again." />
        </View>
      ) : (
        <FlatList
          data={faqs}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <FaqItem item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 12, marginHorizontal: 16 }}
          ListEmptyComponent={<NoData />}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={refetch}
              tintColor="hsl(125, 70%, 33%)"
            />
          }
        />
      )}
    </View>
  );
};

export default FAQScreen;
