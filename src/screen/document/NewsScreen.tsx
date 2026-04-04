import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetAllNewsQuery } from '@/src/services/publicApi';
import { Newspaper, Calendar, AlertCircle, ChevronRight } from 'lucide-react-native';
import ScreenHeader from '@/src/components/common/ScreenHeader';
import { navigate } from '@/src/utils/NavigationUtils';

// ─── types ────────────────────────────────────────────────────────────────────

interface INews {
  _id: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-BD', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const getInitials = (title: string) =>
  title
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

// Cycle through a few accent shades based on index
const ACCENT_SETS = [
  { bg: 'bg-primary/15', text: 'text-primary' },
  { bg: 'bg-yellow-500/15', text: 'text-yellow-500' },
  { bg: 'bg-destructive/15', text: 'text-destructive' },
  { bg: 'bg-primary/10', text: 'text-primary' },
];
const getAccent = (idx: number) => ACCENT_SETS[idx % ACCENT_SETS.length];

// ─── News Card ────────────────────────────────────────────────────────────────

const NewsCard = ({
  item,
  index,
  onPress,
}: {
  item: INews;
  index: number;
  onPress: () => void;
}) => {
  const accent = getAccent(index);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.78}
      className="mx-4 mb-3 overflow-hidden rounded-2xl border border-border bg-card">
      <View className="flex-row items-stretch">
        {/* Left avatar */}
        <View className={`w-14 items-center justify-center ${accent.bg} flex-shrink-0`}>
          <Text className={`text-base font-bold ${accent.text}`}>{getInitials(item.title)}</Text>
        </View>

        {/* Content */}
        <View className="flex-1 px-3 py-3.5">
          <Text className="mb-1 text-sm font-bold leading-5 text-cardForeground" numberOfLines={2}>
            {item.title}
          </Text>
          <Text className="mb-2 text-xs leading-4 text-mutedForeground" numberOfLines={2}>
            {item.description}
          </Text>

          {/* Footer meta */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1">
              <Calendar size={11} color="hsl(0, 0%, 60%)" />
              <Text className="text-[11px] text-mutedForeground">{formatDate(item.createdAt)}</Text>
            </View>
            <View className="flex-row items-center gap-0.5">
              <Text className="text-[11px] font-semibold text-primary">Read more</Text>
              <ChevronRight size={12} color="hsl(125, 70%, 33%)" />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = () => (
  <View className="flex-1 items-center justify-center gap-3 px-8 py-16">
    <View className="mb-2 h-16 w-16 items-center justify-center rounded-full bg-muted">
      <Newspaper size={28} color="hsl(0, 0%, 60%)" />
    </View>
    <Text className="text-center text-base font-bold text-foreground">No news yet</Text>
    <Text className="text-center text-sm text-mutedForeground">
      Check back later for updates and announcements.
    </Text>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

const NewsScreen = () => {
  const { top } = useSafeAreaInsets();

  const { data, isLoading, error, refetch, isFetching } = useGetAllNewsQuery();
  const news: INews[] = (data?.data ?? []).filter((n: INews) => n.isActive);

  const openDetail = (item: INews) => {
    navigate('NewsDetails', { newsId: item._id });
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: top }}>
      <ScreenHeader
        title="News"
        description={`${news.length} article${news.length !== 1 ? 's' : ''}`}
        showBack={false}
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" color="hsl(125, 70%, 33%)" />
          <Text className="text-sm text-mutedForeground">Loading news…</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center gap-4 px-8">
          <AlertCircle size={40} color="hsl(0, 83%, 49%)" />
          <Text className="text-center text-base font-bold text-foreground">
            Failed to load news
          </Text>
          <Text className="text-center text-sm text-mutedForeground">
            Something went wrong. Please try again.
          </Text>
          <TouchableOpacity onPress={refetch} className="rounded-2xl bg-primary px-6 py-3">
            <Text className="font-semibold text-primaryForeground">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <NewsCard item={item} index={index} onPress={() => openDetail(item)} />
          )}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 32, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState />}
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

export default NewsScreen;
