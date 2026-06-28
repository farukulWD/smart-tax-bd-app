import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import ScreenHeader from '@/src/components/common/ScreenHeader';
import ConfirmModal from '@/src/components/global/ConfirmModal';
import ProtectedScreen from '@/src/navigation/ProtectedScreen';
import { useAppSelector } from '@/src/redux/hooks';
import { logout } from '@/src/redux/slices/authSlice';
import { store } from '@/src/redux/store';
import { useGetMyOrdersQuery } from '@/src/services/orderApi';
import { useGetMyPaymentsQuery } from '@/src/services/paymentApi';
import { navigate } from '@/src/utils/NavigationUtils';
import { useLocale } from '@/src/localization/useLocale';
import { useTheme } from '@/src/context/ThemeProvider';
import LucideIcon from '@/src/components/common/LucideIcon';
import { useTranslation } from 'react-i18next';
import {
  CreditCard,
  ClipboardList,
  FolderOpen,
  LogOut,
  Trash2,
  User,
  ShieldCheck,
  Info,
  Phone,
  BookOpen,
  Languages,
  ChevronRight,
  FilesIcon,
} from 'lucide-react-native';
import { useGetMyFilesQuery } from '@/src/services/fileApi';
import {
  StatCard,
  MenuItem,
  SectionLabel,
  ProfileStat,
} from '@/src/components/profile/ProfileComponents';

// ─── Main Screen ──────────────────────────────────────────────────────────────

const ProfileScreen = () => {
  const { t } = useTranslation();
  const { setLocale, isEnglish } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);
  const [activeConfirm, setActiveConfirm] = useState<'logout' | 'delete-account' | null>(null);

  const { data: filesResponse } = useGetMyFilesQuery(undefined);
  const { data: orderResponse } = useGetMyOrdersQuery(undefined);
  const { data: paymentResponse } = useGetMyPaymentsQuery(undefined);

  const stats: ProfileStat[] = [
    {
      label: t('profile.orders'),
      value: orderResponse?.data?.length ?? 0,
      icon: <ClipboardList size={17} color="hsl(125, 70%, 33%)" />,
      accent: 'bg-primary/15',
    },
    {
      label: t('profile.payments'),
      value: paymentResponse?.data?.length ?? 0,
      icon: <CreditCard size={17} color="hsl(48, 96%, 53%)" />,
      accent: 'bg-yellow-500/15',
    },
    {
      label: t('profile.documents'),
      value: filesResponse?.data?.length ?? 0,
      icon: <FolderOpen size={17} color="hsl(0, 83%, 49%)" />,
      accent: 'bg-destructive/15',
    },
  ];

  const handleLogout = () => setActiveConfirm('logout');

  const handleDeleteAccount = () => setActiveConfirm('delete-account');

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
      <ScreenHeader title={t('profile.headerTitle')} showBack={false} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}>
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
                  <Text className="text-xs font-bold capitalize text-primary">{user?.status}</Text>
                </View>
              </View>

              {/* Info row */}
              <View className="mt-4 gap-2 rounded-2xl border border-border bg-muted px-4 py-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs text-mutedForeground">{t('profile.role')}</Text>
                  <View className="flex-row items-center gap-1">
                    <ShieldCheck size={12} color="hsl(125, 70%, 33%)" />
                    <Text className="text-xs font-semibold capitalize text-foreground">
                      {user?.role}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-between border-t border-border pt-2">
                  <Text className="text-xs text-mutedForeground">{t('profile.location')}</Text>
                  <Text className="text-xs font-semibold text-mutedForeground">
                    {t('profile.locationNA')}
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
            <Text className="text-base font-bold text-foreground">{t('profile.notSignedIn')}</Text>
            <Text className="mt-1 text-xs leading-5 text-mutedForeground">
              {t('profile.notSignedInDesc')}
            </Text>

            <TouchableOpacity
              className="mt-4 items-center rounded-2xl bg-primary py-3.5"
              activeOpacity={0.85}
              onPress={() => navigate('Auth', { screen: 'SignIn', shouldGoBack: true })}>
              <Text className="text-sm font-bold text-primaryForeground">
                {t('profile.signIn')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-2.5 items-center rounded-2xl border border-border bg-muted py-3.5"
              activeOpacity={0.8}
              onPress={() => navigate('Auth', { screen: 'SignUp' })}>
              <Text className="text-sm font-semibold text-foreground">
                {t('profile.createAccount')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Stats ─────────────────────────────────────────────────────── */}
        {isLoggedIn && (
          <>
            <SectionLabel label={t('profile.overview')} />
            <View className="mx-4 flex-row gap-3">
              {stats.map((s) => (
                <StatCard key={s.label} stat={s} />
              ))}
            </View>
          </>
        )}

        {/* ── Activity ──────────────────────────────────────────────────── */}
        <SectionLabel label={t('profile.activity')} />
        <View className="mx-4 overflow-hidden rounded-2xl border border-border bg-card">
          <MenuItem
            isFirst
            icon={<CreditCard size={16} color="hsl(48, 96%, 53%)" />}
            accent="bg-yellow-500/15"
            label={t('profile.payments')}
            description={t('profile.paymentHistory')}
            onPress={() => navigate('MyPayments')}
          />
          <MenuItem
            icon={<ClipboardList size={16} color="hsl(125, 70%, 33%)" />}
            accent="bg-primary/15"
            label={t('profile.orders')}
            description={t('profile.taxOrders')}
            onPress={() => navigate('MyOrders')}
          />
          <MenuItem
            icon={<FolderOpen size={16} color="hsl(0, 83%, 49%)" />}
            accent="bg-destructive/15"
            label={t('profile.documents')}
            description={t('profile.uploadedFiles')}
            onPress={() => navigate('UploadedDocuments')}
          />
          <MenuItem
            icon={<FilesIcon size={16} color="hsl(75, 90%, 49%)" />}
            accent="bg-blue/15"
            label={'My Files'}
            description={'Your all files'}
            onPress={() => navigate('MyFiles')}
          />
        </View>

        {/* ── Info & Support ────────────────────────────────────────────── */}
        <SectionLabel label={t('profile.infoSupport')} />
        <View className="mx-4 overflow-hidden rounded-2xl border border-border bg-card">
          <MenuItem
            isFirst
            icon={<BookOpen size={16} color="hsl(217, 91%, 55%)" />}
            accent="bg-blue-500/15"
            label={t('profile.aboutUs')}
            description={t('profile.aboutUsDesc')}
            onPress={() => navigate('AboutUs')}
          />
          <MenuItem
            icon={<Phone size={16} color="hsl(125, 70%, 33%)" />}
            accent="bg-primary/15"
            label={t('profile.contactUs')}
            description={t('profile.contactUsDesc')}
            onPress={() => navigate('ContactUs')}
          />
          <MenuItem
            icon={<Languages size={16} color="hsl(270, 60%, 55%)" />}
            accent="bg-purple-500/15"
            label="Language"
            description={isEnglish ? 'English' : 'বাংলা'}
            onPress={() => setLocale(isEnglish ? 'bn' : 'en')}
          />
          <MenuItem
            icon={
              <LucideIcon
                name={theme === 'dark' ? 'Sun' : 'Moon'}
                size={16}
                className="text-foreground"
              />
            }
            accent="bg-muted"
            label="Theme"
            description={theme === 'dark' ? 'Dark' : 'Light'}
            onPress={toggleTheme}
          />
        </View>

        {/* ── Account Actions ───────────────────────────────────────────── */}
        <SectionLabel label={t('profile.account')} />
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
                <Text className="flex-1 text-sm font-semibold text-foreground">
                  {t('profile.signOut')}
                </Text>
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
                  <Text className="text-sm font-semibold text-destructive">
                    {t('profile.deleteAccount')}
                  </Text>
                  <Text className="mt-0.5 text-xs text-mutedForeground">
                    {t('profile.deleteAccountDesc')}
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
              <Text className="flex-1 text-sm font-semibold text-foreground">
                {t('profile.signIn')}
              </Text>
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

      <ConfirmModal
        visible={activeConfirm === 'logout'}
        title={t('profile.signOut')}
        message={t('profile.signOutConfirm')}
        confirmLabel={t('profile.signOut')}
        cancelLabel={t('common.cancel')}
        destructive
        onConfirm={() => {
          store.dispatch(logout());
          setActiveConfirm(null);
        }}
        onCancel={() => setActiveConfirm(null)}
      />

      <ConfirmModal
        visible={activeConfirm === 'delete-account'}
        title={t('profile.deleteAccount')}
        message={t('profile.deleteAccountDesc')}
        confirmLabel={t('profile.deleteConfirm')}
        cancelLabel={t('common.cancel')}
        destructive
        onConfirm={() => {
          setActiveConfirm(null);
        }}
        onCancel={() => setActiveConfirm(null)}
      />
    </ProtectedScreen>
  );
};

export default ProfileScreen;
