import React from 'react';
import { ActivityIndicator, ScrollView, Text, View, Pressable } from 'react-native';
import { AppStackParamList } from '@/src/navigation/AppStack';
import { useGetSingleNewsQuery } from '@/src/services/publicApi';
import { RouteProp, useRoute } from '@react-navigation/native';
import { goBack } from '@/src/utils/NavigationUtils';
import { formatDate } from '@/src/utils/commonFunction';

type Props = RouteProp<AppStackParamList, 'NewsDetails'>;

const NewsDetailsScreen = () => {
  const route = useRoute<Props>();
  const { newsId } = route.params;
  const { data, isLoading, error } = useGetSingleNewsQuery(newsId);
  const news = data?.data;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-6">
        <ActivityIndicator size="large" />
        <Text className="mt-3 text-base text-slate-600">Loading news...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-6">
        <Text className="mb-2 text-xl font-bold text-slate-900">Something went wrong</Text>
        <Text className="text-center text-sm leading-6 text-slate-500">
          Failed to load the news details.
        </Text>

        <Pressable onPress={() => goBack()} className="mt-5 rounded-full bg-slate-900 px-5 py-3">
          <Text className="font-semibold text-white">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  if (!news) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-6">
        <Text className="mb-2 text-xl font-bold text-slate-900">No news found</Text>
        <Text className="text-center text-sm leading-6 text-slate-500">
          The requested news details are not available.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <View className="flex-row items-center justify-between border-b border-slate-200 bg-white px-4 pb-4 pt-14">
        <Pressable
          onPress={() => goBack()}
          className="rounded-full border border-slate-200 px-4 py-2">
          <Text className="text-sm font-medium text-slate-700">Back</Text>
        </Pressable>

        <Text className="text-base font-semibold text-slate-900">News Details</Text>

        <View className="w-[68px]" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="p-4 pb-8">
        <View className="rounded-3xl bg-white p-5 shadow-sm">
          <View className="mb-4 self-start rounded-full bg-sky-100 px-3 py-1.5">
            <Text className="text-xs font-semibold text-sky-700">
              {news.isActive ? 'Active News' : 'Inactive News'}
            </Text>
          </View>

          <Text className="mb-4 text-2xl font-bold leading-9 text-slate-900">{news.title}</Text>

          <View className="mb-5 rounded-2xl bg-slate-50 p-4">
            <Text className="mb-2 text-sm font-semibold text-slate-700">Description</Text>
            <Text className="text-base leading-7 text-slate-600">{news.description}</Text>
          </View>

          <View className="gap-y-4 border-t border-slate-200 pt-5">
            <View>
              <Text className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                News ID
              </Text>
              <Text className="text-sm leading-6 text-slate-800">{news._id}</Text>
            </View>

            <View>
              <Text className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Created At
              </Text>
              <Text className="text-sm text-slate-800">{formatDate(news.createdAt)}</Text>
            </View>

            <View>
              <Text className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Updated At
              </Text>
              <Text className="text-sm text-slate-800">{formatDate(news.updatedAt)}</Text>
            </View>

            <View>
              <Text className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Status
              </Text>
              <Text
                className={`text-sm font-semibold ${
                  news.isActive ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                {news.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default NewsDetailsScreen;
