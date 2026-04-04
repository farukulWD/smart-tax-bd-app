import React from 'react';
import { ActivityIndicator, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { AppStackParamList } from '@/src/navigation/AppStack';
import { useGetSingleNewsQuery } from '@/src/services/publicApi';
import { RouteProp, useRoute } from '@react-navigation/native';
import { goBack } from '@/src/utils/NavigationUtils';
import { formatDate } from '@/src/utils/commonFunction';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Hash,
  RefreshCw,
  Newspaper,
  CheckCircle2,
  XCircle,
} from 'lucide-react-native';

type Props = RouteProp<AppStackParamList, 'NewsDetails'>;

// ─── Meta Row ─────────────────────────────────────────────────────────────────

const MetaRow = ({
  icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) => (
  <View className="flex-row items-start justify-between border-b border-border py-3.5 last:border-b-0">
    <View className="flex-row items-center gap-2">
      {icon}
      <Text className="text-xs font-semibold uppercase tracking-wider text-mutedForeground">
        {label}
      </Text>
    </View>
    <Text
      className={`ml-6 flex-shrink text-right text-xs font-semibold ${
        valueClassName ?? 'text-foreground'
      }`}
      numberOfLines={2}>
      {value}
    </Text>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

const NewsDetailsScreen = () => {
  const route = useRoute<Props>();
  const { newsId } = route.params;
  const { top } = useSafeAreaInsets();

  const { data, isLoading, error, refetch } = useGetSingleNewsQuery(newsId);
  const news = data?.data;

  // ── Loading ──────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center gap-3 bg-background"
        style={{ paddingTop: top }}>
        <ActivityIndicator size="large" color="hsl(125, 70%, 33%)" />
        <Text className="text-sm text-mutedForeground">Loading article…</Text>
      </View>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <View
        className="flex-1 items-center justify-center gap-4 bg-background px-8"
        style={{ paddingTop: top }}>
        <View className="bg-destructive/15 mb-2 h-16 w-16 items-center justify-center rounded-full">
          <XCircle size={32} color="hsl(0, 83%, 49%)" />
        </View>
        <Text className="text-center text-lg font-bold text-foreground">Something went wrong</Text>
        <Text className="text-center text-sm leading-5 text-mutedForeground">
          Failed to load the news details. Please try again.
        </Text>
        <View className="mt-2 flex-row gap-3">
          <TouchableOpacity
            onPress={() => goBack()}
            className="rounded-2xl border border-border px-5 py-3">
            <Text className="text-sm font-semibold text-foreground">Go Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => refetch()}
            className="flex-row items-center gap-2 rounded-2xl bg-primary px-5 py-3">
            <RefreshCw size={14} color="#fff" />
            <Text className="text-sm font-semibold text-primaryForeground">Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Not Found ────────────────────────────────────────────────────────────

  if (!news) {
    return (
      <View
        className="flex-1 items-center justify-center gap-3 bg-background px-8"
        style={{ paddingTop: top }}>
        <View className="mb-2 h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Newspaper size={28} color="hsl(0, 0%, 60%)" />
        </View>
        <Text className="text-center text-lg font-bold text-foreground">No article found</Text>
        <Text className="text-center text-sm text-mutedForeground">
          The requested news article is not available.
        </Text>
        <TouchableOpacity
          onPress={() => goBack()}
          className="mt-2 rounded-2xl bg-primary px-6 py-3">
          <Text className="font-semibold text-primaryForeground">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Content ──────────────────────────────────────────────────────────────

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-border px-4 pb-2">
        <TouchableOpacity
          onPress={() => goBack()}
          activeOpacity={0.75}
          className="h-10 w-10 items-center justify-center rounded-full border border-border bg-muted">
          <ArrowLeft size={22} color="hsl(125, 70%, 33%)" />
        </TouchableOpacity>

        <View className="flex-row items-center gap-2">
          <Newspaper size={25} color="hsl(125, 70%, 33%)" />
          <Text className="text-lg font-bold text-foreground">News Details</Text>
        </View>

        {/* Spacer to center title */}
        <View className="w-9" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Status badge */}
        <View className="mb-4 flex-row">
          <View
            className={`flex-row items-center gap-1.5 rounded-full px-3 py-1.5 ${
              news.isActive ? 'bg-primary' : 'bg-destructive'
            }`}>
            {news.isActive ? (
              <CheckCircle2 size={13} color="white" />
            ) : (
              <XCircle size={13} color="white" />
            )}
            <Text className={`text-xs font-bold ${news.isActive ? 'text-white' : 'text-white'}`}>
              {news.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text className="mb-5 text-2xl font-bold leading-8 text-foreground">{news.title}</Text>

        {/* Description card */}
        <View className="mb-4 rounded-2xl border border-border bg-card p-4">
          <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-mutedForeground">
            Description
          </Text>
          <Text className="text-sm leading-7 text-foreground">{news.description}</Text>
        </View>

        {/* Meta card */}
        <View className="mb-4 rounded-2xl border border-border bg-card px-4">
          <MetaRow
            icon={<Hash size={13} color="hsl(0, 0%, 60%)" />}
            label="News ID"
            value={news._id}
          />
          <MetaRow
            icon={<Calendar size={13} color="hsl(0, 0%, 60%)" />}
            label="Created At"
            value={formatDate(news.createdAt)}
          />
          <MetaRow
            icon={<Clock size={13} color="hsl(0, 0%, 60%)" />}
            label="Updated At"
            value={formatDate(news.updatedAt)}
          />
          <MetaRow
            icon={
              news.isActive ? (
                <CheckCircle2 size={13} color="hsl(125, 70%, 33%)" />
              ) : (
                <XCircle size={13} color="hsl(0, 83%, 49%)" />
              )
            }
            label="Status"
            value={news.isActive ? 'Active' : 'Inactive'}
            valueClassName={news.isActive ? 'text-primary' : 'text-destructive'}
          />
        </View>

        {/* Back button */}
        <TouchableOpacity
          onPress={() => goBack()}
          activeOpacity={0.85}
          className="mt-2 items-center rounded-2xl bg-primary py-4">
          <Text className="text-base font-bold text-primaryForeground">Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default NewsDetailsScreen;
