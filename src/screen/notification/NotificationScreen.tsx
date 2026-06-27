import React, { useCallback, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Bell, AlertCircle, FileText, CreditCard, Megaphone } from 'lucide-react-native';
import ScreenHeader from '@/src/components/common/ScreenHeader';

type NotificationType = 'tax_reminder' | 'news' | 'payment' | 'system' | 'deadline';

type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
};

type Section = {
  title: string;
  data: NotificationItem[];
};

const NOTIFICATION_ICONS: Record<NotificationType, { icon: React.ReactNode; color: string }> = {
  tax_reminder: { icon: <AlertCircle size={20} color="#d97706" />, color: 'bg-amber-100' },
  news: { icon: <Megaphone size={20} color="#2563eb" />, color: 'bg-blue-100' },
  payment: { icon: <CreditCard size={20} color="#059669" />, color: 'bg-green-100' },
  system: { icon: <Bell size={20} color="#7c3aed" />, color: 'bg-purple-100' },
  deadline: { icon: <FileText size={20} color="#dc2626" />, color: 'bg-red-100' },
};

const DUMMY_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'tax_reminder',
    title: 'Tax Filing Deadline Approaching',
    description:
      'Your tax return for fiscal year 2025-2026 is due in 15 days. Submit your documents to avoid penalties.',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Successful',
    description:
      'Your payment of BDT 5,000 for tax order #TXN-2024-8921 has been processed successfully.',
    timestamp: '5 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'deadline',
    title: 'Document Submission Reminder',
    description:
      'You have 3 pending documents for your ongoing tax order. Please upload them at your earliest convenience.',
    timestamp: '8 hours ago',
    read: true,
  },
  {
    id: '4',
    type: 'news',
    title: 'New Tax Policy Update',
    description:
      'The government has announced revised tax slabs for individual taxpayers effective from July 2026.',
    timestamp: 'Yesterday',
    read: false,
  },
  {
    id: '5',
    type: 'system',
    title: 'Profile Update Required',
    description:
      'Please update your contact information to ensure smooth communication regarding your tax matters.',
    timestamp: 'Yesterday',
    read: true,
  },
  {
    id: '6',
    type: 'tax_reminder',
    title: 'Return Acknowledged',
    description:
      'Your tax return for FY 2024-2025 has been received and is under review by the tax authority.',
    timestamp: 'Yesterday',
    read: true,
  },
  {
    id: '7',
    type: 'payment',
    title: 'Receipt Generated',
    description: 'Payment receipt for BDT 12,000 has been generated for order #ORD-2026-0042.',
    timestamp: '3 days ago',
    read: false,
  },
  {
    id: '8',
    type: 'news',
    title: 'Smart Tax BD Feature Update',
    description:
      'We have added new features to simplify your tax filing process. Check out the latest updates now.',
    timestamp: '5 days ago',
    read: true,
  },
  {
    id: '9',
    type: 'system',
    title: 'Account Security Alert',
    description:
      'A new login was detected from Dhaka, Bangladesh on June 25, 2026. If this was not you, please secure your account immediately.',
    timestamp: '1 week ago',
    read: false,
  },
  {
    id: '10',
    type: 'deadline',
    title: 'Tax Notice Received',
    description:
      'You have received a notice from the tax office regarding your submitted return. Please check your documents.',
    timestamp: '2 weeks ago',
    read: true,
  },
];

const groupNotifications = (items: NotificationItem[]): Section[] => {
  const groups: Record<string, NotificationItem[]> = {
    Today: [],
    Yesterday: [],
    'This Week': [],
    Earlier: [],
  };

  items.forEach((item) => {
    if (item.timestamp.includes('hour') || item.timestamp.includes('minute')) {
      groups['Today'].push(item);
    } else if (item.timestamp === 'Yesterday') {
      groups['Yesterday'].push(item);
    } else if (item.timestamp.includes('day') || item.timestamp.includes('days')) {
      const days = parseInt(item.timestamp.split(' ')[0]);
      if (days <= 7) {
        groups['This Week'].push(item);
      } else {
        groups['Earlier'].push(item);
      }
    } else if (item.timestamp.includes('week')) {
      groups['Earlier'].push(item);
    } else {
      groups['Earlier'].push(item);
    }
  });

  return Object.entries(groups)
    .filter(([, data]) => data.length > 0)
    .map(([title, data]) => ({ title, data }));
};

const NotificationCard = React.memo(({ item }: { item: NotificationItem }) => {
  const meta = NOTIFICATION_ICONS[item.type];

  return (
    <View
      className={`flex-row gap-3 rounded-2xl border p-4 ${
        item.read ? 'border-border bg-card' : 'border-primary/20 bg-primary/5'
      }`}>
      <View className={`h-10 w-10 items-center justify-center rounded-xl ${meta.color}`}>
        {meta.icon}
      </View>

      <View className="flex-1 gap-1">
        <View className="flex-row items-start justify-between">
          <Text
            className={`flex-1 text-sm font-semibold ${item.read ? 'text-foreground' : 'text-foreground'}`}>
            {item.title}
          </Text>
          {!item.read && <View className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
        </View>
        <Text className="text-[13px] leading-5 text-mutedForeground" numberOfLines={3}>
          {item.description}
        </Text>
        <Text className="text-mutedForeground/70 text-[11px] font-medium">{item.timestamp}</Text>
      </View>
    </View>
  );
});

const NotificationScreen = () => {
  const [sections] = useState(() => groupNotifications(DUMMY_NOTIFICATIONS));

  const unreadCount = DUMMY_NOTIFICATIONS.filter((n) => !n.read).length;

  const renderItem = useCallback(
    ({ item }: { item: NotificationItem }) => <NotificationCard item={item} />,
    []
  );

  const keyExtractor = useCallback((item: NotificationItem) => item.id, []);

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Notification" />
      <FlatList
        data={sections.flatMap((s) => s.data)}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerClassName="px-4 pb-8"
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-2.5" />}
        ListHeaderComponent={() => (
          <View className="mb-4 mt-4 flex-row items-center gap-3 rounded-2xl bg-muted px-4 py-3">
            <Bell size={18} color="hsl(0, 0%, 60%)" />
            <Text className="flex-1 text-[13px] text-mutedForeground">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
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
    </View>
  );
};

export default NotificationScreen;
