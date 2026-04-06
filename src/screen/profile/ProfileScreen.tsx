import ScreenHeader from '@/src/components/common/ScreenHeader';
import ProtectedScreen from '@/src/navigation/ProtectedScreen';
import { useAppSelector } from '@/src/redux/hooks';
import { logout } from '@/src/redux/slices/authSlice';
import { store } from '@/src/redux/store';
import { useGetMyOrdersQuery } from '@/src/services/orderApi';
import { useGetMyPaymentsQuery } from '@/src/services/paymentApi';
import { navigate } from '@/src/utils/NavigationUtils';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CreditCard,
  ClipboardList,
  FolderOpen,
  LogOut,
  Trash2,
  ChevronRight,
  User,
  ShieldCheck,
  Info,
} from 'lucide-react-native';
import { useGetMyFilesQuery } from '@/src/services/fileApi';

// ─── types ────────────────────────────────────────────────────────────────────

type ProfileStat = { label: string; value: number; icon: React.ReactNode; accent: string };

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ stat }: { stat: ProfileStat }) => (
  <View className="flex-1 items-center gap-1 rounded-2xl border border-border bg-card px-3 py-3.5">
    <View className={`mb-1 h-9 w-9 items-center justify-center rounded-full ${stat.accent}`}>
      {stat.icon}
    </View>
    <Text className="text-lg font-bold text-foreground">{stat.value}</Text>
    <Text className="text-[11px] text-mutedForeground">{stat.label}</Text>
  </View>
);

// ─── Menu Item ────────────────────────────────────────────────────────────────

const MenuItem = ({
  icon,
  label,
  description,
  onPress,
  isFirst,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onPress: () => void;
  isFirst?: boolean;
  accent?: string;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.72}
    className={`flex-row items-center gap-3 px-4 py-3.5 ${!isFirst ? 'border-t border-border' : ''}`}>
    <View className={`h-9 w-9 items-center justify-center rounded-xl ${accent ?? 'bg-muted'}`}>
      {icon}
    </View>
    <View className="flex-1">
      <Text className="text-sm font-semibold text-foreground">{label}</Text>
      {description && <Text className="mt-0.5 text-xs text-mutedForeground">{description}</Text>}
    </View>
    <ChevronRight size={15} color="hsl(0, 0%, 60%)" />
  </TouchableOpacity>
);

// ─── Section Header ───────────────────────────────────────────────────────────

const SectionLabel = ({ label }: { label: string }) => (
  <Text className="mx-4 mb-2 mt-5 text-xs font-bold uppercase tracking-widest text-mutedForeground">
    {label}
  </Text>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

const ProfileScreen = () => {
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);

  const { data: filesResponse } = useGetMyFilesQuery(undefined);
  const { data: orderResponse } = useGetMyOrdersQuery(undefined);
  const { data: paymentResponse } = useGetMyPaymentsQuery(undefined);

  const stats: ProfileStat[] = [
    {
      label: 'Orders',
      value: orderResponse?.data?.length ?? 0,
      icon: <ClipboardList size={17} color="hsl(125, 70%, 33%)" />,
      accent: 'bg-primary/15',
    },
    {
      label: 'Payments',
      value: paymentResponse?.data?.length ?? 0,
      icon: <CreditCard size={17} color="hsl(48, 96%, 53%)" />,
      accent: 'bg-yellow-500/15',
    },
    {
      label: 'Documents',
      value: filesResponse?.data?.length ?? 0,
      icon: <FolderOpen size={17} color="hsl(0, 83%, 49%)" />,
      accent: 'bg-destructive/15',
    },
  ];

  const handleLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => store.dispatch(logout()),
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      "This action is permanent and can't be undone. All your data will be removed.",
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((w: string) => w[0])
        .join('')
        .toUpperCase()
    : '?';

  return (
    <ProtectedScreen redirectTo={{ stack: 'ProfileStack', screen: 'Profile' }}>
      <SafeAreaView edges={['top']} className="flex-1 bg-background">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}>
          <ScreenHeader
            title="Profile"
            description="Manage your account and preferences"
            showBack={false}
          />

          {/* ── User Card ─────────────────────────────────────────────────── */}
          {isLoggedIn ? (
            <View className="mx-4 mt-2 overflow-hidden rounded-3xl border border-border bg-card">
              {/* Green accent strip */}
              <View className="h-2 w-full bg-primary" />

              <View className="px-4 pb-4 pt-4">
                <View className="flex-row items-center">
                  {/* Avatar */}
                  <View className="bg-primary/20 h-14 w-14 items-center justify-center rounded-full border-2 border-primary">
                    <Text className="text-lg font-bold text-primary">{initials}</Text>
                  </View>

                  <View className="ml-3 flex-1">
                    <Text className="text-base font-bold text-foreground">{user?.name}</Text>
                    <Text className="mt-0.5 text-xs text-mutedForeground">{user?.email}</Text>
                    <Text className="text-xs text-mutedForeground">{user?.mobile}</Text>
                  </View>

                  {/* Status badge */}
                  <View className="rounded-full border border-[#3ca34d79] bg-[#3ca34d1f] px-3 py-1">
                    <Text className="text-xs font-bold capitalize text-primary">
                      {user?.status}
                    </Text>
                  </View>
                </View>

                {/* Info row */}
                <View className="mt-4 gap-2 rounded-2xl border border-border bg-muted px-4 py-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-mutedForeground">Role</Text>
                    <View className="flex-row items-center gap-1">
                      <ShieldCheck size={12} color="hsl(125, 70%, 33%)" />
                      <Text className="text-xs font-semibold capitalize text-foreground">
                        {user?.role}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center justify-between border-t border-border pt-2">
                    <Text className="text-xs text-mutedForeground">Location</Text>
                    <Text className="text-xs font-semibold text-mutedForeground">
                      Not available
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            /* ── Guest Card ─────────────────────────────────────────────── */
            <View className="mx-4 mt-2 rounded-3xl border border-border bg-card px-4 py-5">
              <View className="mb-3 h-14 w-14 items-center justify-center rounded-full border border-border bg-muted">
                <User size={24} color="hsl(0, 0%, 60%)" />
              </View>
              <Text className="text-base font-bold text-foreground">You're not signed in</Text>
              <Text className="mt-1 text-xs leading-5 text-mutedForeground">
                Sign in to sync your data, save drafts, and manage tax info.
              </Text>

              <TouchableOpacity
                className="mt-4 items-center rounded-2xl bg-primary py-3.5"
                activeOpacity={0.85}
                onPress={() => navigate('Auth', { screen: 'SignIn', shouldGoBack: true })}>
                <Text className="text-sm font-bold text-primaryForeground">Sign In</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="mt-2.5 items-center rounded-2xl border border-border bg-muted py-3.5"
                activeOpacity={0.8}
                onPress={() => navigate('Auth', { screen: 'SignUp' })}>
                <Text className="text-sm font-semibold text-foreground">Create Account</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Stats ─────────────────────────────────────────────────────── */}
          {isLoggedIn && (
            <>
              <SectionLabel label="Overview" />
              <View className="mx-4 flex-row gap-3">
                {stats.map((s) => (
                  <StatCard key={s.label} stat={s} />
                ))}
              </View>
            </>
          )}

          {/* ── Activity ──────────────────────────────────────────────────── */}
          <SectionLabel label="Activity" />
          <View className="mx-4 overflow-hidden rounded-2xl border border-border bg-card">
            <MenuItem
              isFirst
              icon={<CreditCard size={16} color="hsl(48, 96%, 53%)" />}
              accent="bg-yellow-500/15"
              label="Payments"
              description="View all your payment history"
              onPress={() => navigate('MyPayments')}
            />
            <MenuItem
              icon={<ClipboardList size={16} color="hsl(125, 70%, 33%)" />}
              accent="bg-primary/15"
              label="Orders"
              description="See all of your tax orders"
              onPress={() => navigate('MyOrders')}
            />
            <MenuItem
              icon={<FolderOpen size={16} color="hsl(0, 83%, 49%)" />}
              accent="bg-destructive/15"
              label="Uploaded Documents"
              description="Manage your uploaded files"
              onPress={() => navigate('UploadedDocuments')}
            />
          </View>

          {/* ── Account Actions ───────────────────────────────────────────── */}
          <SectionLabel label="Account" />
          <View className="mx-4 overflow-hidden rounded-2xl border border-border bg-card">
            {isLoggedIn ? (
              <>
                <TouchableOpacity
                  onPress={handleLogout}
                  activeOpacity={0.75}
                  className="flex-row items-center gap-3 px-4 py-3.5">
                  <View className="h-9 w-9 items-center justify-center rounded-xl bg-muted">
                    <LogOut size={16} color="hsl(0, 0%, 60%)" />
                  </View>
                  <Text className="flex-1 text-sm font-semibold text-foreground">Sign out</Text>
                  <ChevronRight size={15} color="hsl(0, 0%, 60%)" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDeleteAccount}
                  activeOpacity={0.75}
                  className="flex-row items-center gap-3 border-t border-border px-4 py-3.5">
                  <View className="bg-destructive/15 h-9 w-9 items-center justify-center rounded-xl">
                    <Trash2 size={16} color="hsl(0, 83%, 49%)" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-destructive">Delete account</Text>
                    <Text className="mt-0.5 text-xs text-mutedForeground">
                      This can't be undone.
                    </Text>
                  </View>
                  <ChevronRight size={15} color="hsl(0, 83%, 49%)" />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={() => navigate('Auth', { screen: 'SignIn', shouldGoBack: true })}
                activeOpacity={0.75}
                className="flex-row items-center gap-3 px-4 py-3.5">
                <View className="bg-primary/15 h-9 w-9 items-center justify-center rounded-xl">
                  <User size={16} color="hsl(125, 70%, 33%)" />
                </View>
                <Text className="flex-1 text-sm font-semibold text-foreground">Sign in</Text>
                <ChevronRight size={15} color="hsl(0, 0%, 60%)" />
              </TouchableOpacity>
            )}
          </View>

          {/* ── App meta ─────────────────────────────────────────────────── */}
          <View className="mx-4 mt-5 flex-row items-center justify-center gap-1.5">
            <Info size={12} color="hsl(0, 0%, 60%)" />
            <Text className="text-xs text-mutedForeground">Version 1.0.0</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ProtectedScreen>
  );
};

export default ProfileScreen;
