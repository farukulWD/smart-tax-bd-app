import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  Bell,
  AlertCircle,
  FileText,
  CreditCard,
  Megaphone,
  CheckCheck,
  Trash2,
} from 'lucide-react-native';
import ScreenHeader from '@/src/components/common/ScreenHeader';
import ConfirmModal from '@/src/components/global/ConfirmModal';
import {
  useGetMyNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  INotification,
  TNotificationType,
} from '@/src/services/notificationApi';
import ProtectedScreen from '@/src/navigation/ProtectedScreen';

type UITheme = 'tax_reminder' | 'news' | 'payment' | 'system' | 'deadline';

const NOTIFICATION_ICONS: Record<UITheme, { icon: React.ReactNode; color: string }> = {
  tax_reminder: { icon: <AlertCircle size={20} color="#d97706" />, color: 'bg-amber-100' },
  news: { icon: <Megaphone size={20} color="#2563eb" />, color: 'bg-blue-100' },
  payment: { icon: <CreditCard size={20} color="#059669" />, color: 'bg-green-100' },
  system: { icon: <Bell size={20} color="#7c3aed" />, color: 'bg-purple-100' },
  deadline: { icon: <FileText size={20} color="#dc2626" />, color: 'bg-red-100' },
};

const mapNotificationType = (type: TNotificationType): UITheme => {
  if (
    type === 'TAX_ORDER_CREATED' ||
    type === 'TAX_ORDER_UPDATED' ||
    type === 'DOCUMENTS_UPLOADED' ||
    type === 'TAX_ORDER_PLACED' ||
    type === 'TAX_AMOUNTS_UPDATED' ||
    type === 'FILE_UPLOADED' ||
    type === 'FILE_DELETED'
  ) {
    return 'tax_reminder';
  }
  if (
    type === 'PAYMENT_INITIATED' ||
    type === 'PAYMENT_SUCCESS' ||
    type === 'PAYMENT_FAILED' ||
    type === 'PAYMENT_CANCELLED'
  ) {
    return 'payment';
  }
  if (type === 'NEWS_PUBLISHED' || type === 'NEWS_UPDATED') {
    return 'news';
  }
  if (type === 'USER_REGISTERED' || type === 'PASSWORD_CHANGED' || type === 'PASSWORD_RESET') {
    return 'system';
  }
  return 'deadline';
};

const formatRelativeTime = (dateStr: string): string => {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 2) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  return dateStr.split('T')[0];
};

type TimeGroup = 'Today' | 'Yesterday' | 'This Week' | 'Earlier';

const getTimeGroup = (dateStr: string): TimeGroup => {
  const now = new Date();
  const date = new Date(dateStr);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86400000;
  const startOfWeek = startOfToday - now.getDay() * 86400000;
  const dateTime = date.getTime();

  if (dateTime >= startOfToday) return 'Today';
  if (dateTime >= startOfYesterday) return 'Yesterday';
  if (dateTime >= startOfWeek) return 'This Week';
  return 'Earlier';
};

const groupNotifications = (items: INotification[]): { title: string; data: INotification[] }[] => {
  const groups: Record<TimeGroup, INotification[]> = {
    Today: [],
    Yesterday: [],
    'This Week': [],
    Earlier: [],
  };

  items.forEach((item) => {
    const group = getTimeGroup(item.createdAt);
    groups[group].push(item);
  });

  return Object.entries(groups)
    .filter(([, data]) => data.length > 0)
    .map(([title, data]) => ({ title, data }));
};

const NotificationCard = React.memo(
  ({
    item,
    onPress,
    onDelete,
  }: {
    item: INotification;
    onPress: () => void;
    onDelete: () => void;
  }) => {
    const uiType = mapNotificationType(item.type);
    const meta = NOTIFICATION_ICONS[uiType];

    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.78}
        className={`flex-row gap-3 rounded-2xl border p-4 ${
          item.isRead ? 'border-border bg-card' : 'border-primary/20 bg-primary/5'
        }`}>
        <View className={`h-10 w-10 items-center justify-center rounded-xl ${meta.color}`}>
          {meta.icon}
        </View>

        <View className="flex-1 gap-1">
          <View className="flex-row items-start justify-between">
            <Text
              className={`flex-1 text-sm font-semibold ${
                item.isRead ? 'text-foreground' : 'text-foreground'
              }`}>
              {item.title}
            </Text>
            {!item.isRead && <View className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
          </View>
          <Text className="text-[13px] leading-5 text-mutedForeground" numberOfLines={3}>
            {item.message}
          </Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-mutedForeground/70 text-[11px] font-medium">
              {formatRelativeTime(item.createdAt)}
            </Text>
            <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Trash2 size={14} color="hsl(0, 0%, 60%)" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

const NotificationScreen = () => {
  const [page, setPage] = useState(1);
  const [allNotifications, setAllNotifications] = useState<INotification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showMarkAllModal, setShowMarkAllModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { data, isLoading, isFetching, error, refetch } = useGetMyNotificationsQuery({
    page,
    limit: 20,
  });
  const { data: unreadData } = useGetUnreadCountQuery();

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const unreadCount = unreadData?.data?.count ?? 0;
  const totalPage = data?.meta?.totalPage ?? 1;

  const notifications = React.useMemo(() => {
    if (page === 1 && data?.data) return data.data;
    return allNotifications;
  }, [data, page, allNotifications]);

  React.useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setAllNotifications(data.data);
      } else {
        setAllNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n._id));
          const newItems = data.data.filter((n) => !existingIds.has(n._id));
          return [...prev, ...newItems];
        });
      }
    }
  }, [data, page]);

  const sections = React.useMemo(() => groupNotifications(notifications), [notifications]);

  const handleMarkAsRead = useCallback(
    async (item: INotification) => {
      if (!item.isRead) {
        try {
          await markAsRead(item._id).unwrap();
        } catch {
          // silently fail
        }
      }
    },
    [markAsRead]
  );

  const handleMarkAllAsRead = useCallback(() => {
    setShowMarkAllModal(true);
  }, []);

  const handleConfirmMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead().unwrap();
    } catch {
      // silently fail
    }
    setShowMarkAllModal(false);
  }, [markAllAsRead]);

  const handleDelete = useCallback(
    (id: string) => {
      setDeleteTarget(id);
    },
    [],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteNotification(deleteTarget).unwrap();
    } catch {
      // silently fail
    }
    setDeleteTarget(null);
  }, [deleteTarget, deleteNotification]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    try {
      await refetch();
    } catch {
      // ignore
    }
    setRefreshing(false);
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (!isFetching && page < totalPage) {
      setPage((p) => p + 1);
    }
  }, [isFetching, page, totalPage]);

  const renderItem = useCallback(
    ({ item }: { item: INotification }) => (
      <NotificationCard
        item={item}
        onPress={() => handleMarkAsRead(item)}
        onDelete={() => handleDelete(item._id)}
      />
    ),
    [handleMarkAsRead, handleDelete]
  );

  const keyExtractor = useCallback((item: INotification) => item._id, []);

  return (
    <ProtectedScreen>
      {isLoading && page === 1 ? (
        <View className="flex-1 bg-background">
          <ScreenHeader title="Notification" />
          <View className="flex-1 items-center justify-center gap-3">
            <ActivityIndicator size="large" color="hsl(125, 70%, 33%)" />
            <Text className="text-sm text-mutedForeground">Loading notifications…</Text>
          </View>
        </View>
      ) : error ? (
        <View className="flex-1 bg-background">
          <ScreenHeader title="Notification" />
          <View className="flex-1 items-center justify-center gap-4 px-8">
            <View className="bg-destructive/15 h-16 w-16 items-center justify-center rounded-full">
              <Bell size={28} color="hsl(0, 83%, 49%)" />
            </View>
            <Text className="text-center text-lg font-bold text-foreground">
              Failed to load notifications
            </Text>
            <Text className="text-center text-sm text-mutedForeground">
              Something went wrong. Pull down to try again.
            </Text>
            <TouchableOpacity onPress={() => refetch()} className="rounded-2xl bg-primary px-6 py-3">
              <Text className="font-semibold text-primaryForeground">Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="flex-1 bg-background">
          <ScreenHeader
            title="Notification"
            rightButton={
              unreadCount > 0
                ? {
                    icon: <CheckCheck size={20} color="white" />,
                    onPress: handleMarkAllAsRead,
                  }
                : undefined
            }
          />
          <FlatList
            data={sections.flatMap((s) => s.data)}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerClassName="px-4 pb-8 pt-4"
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            ItemSeparatorComponent={() => <View className="h-2.5" />}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="hsl(125, 70%, 33%)"
              />
            }
            ListHeaderComponent={() =>
              unreadCount > 0 ? (
                <View className="mb-4 mt-4 flex-row items-center gap-3 rounded-2xl bg-muted px-4 py-3">
                  <Bell size={18} color="hsl(0, 0%, 60%)" />
                  <Text className="flex-1 text-[13px] text-mutedForeground">
                    You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </Text>
                </View>
              ) : null
            }
            ListFooterComponent={() =>
              isFetching && page > 1 ? (
                <View className="py-4">
                  <ActivityIndicator size="small" color="hsl(125, 70%, 33%)" />
                </View>
              ) : null
            }
            ListEmptyComponent={() => (
              <View className="mt-20 items-center gap-4">
                <View className="h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Bell size={28} color="hsl(0, 0%, 60%)" />
                </View>
                <Text className="text-lg font-bold text-foreground">All caught up!</Text>
                <Text className="text-center text-sm text-mutedForeground">
                  You have no notifications at this time.
                </Text>
              </View>
            )}
          />

          <ConfirmModal
            visible={showMarkAllModal}
            title="Mark all as read"
            message="Mark all notifications as read?"
            confirmLabel="Mark All"
            cancelLabel="Cancel"
            onConfirm={handleConfirmMarkAllAsRead}
            onCancel={() => setShowMarkAllModal(false)}
          />

          <ConfirmModal
            visible={!!deleteTarget}
            title="Delete notification"
            message="Are you sure you want to delete this notification?"
            confirmLabel="Delete"
            cancelLabel="Cancel"
            destructive
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        </View>
      )}
    </ProtectedScreen>
  );
};

export default NotificationScreen;
