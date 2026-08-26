import { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import AppText from '@/src/components/common/AppText';
import ScreenHeader from '@/src/components/common/ScreenHeader';
import ConfirmModal from '@/src/components/global/ConfirmModal';
import ProtectedScreen from '@/src/navigation/ProtectedScreen';
import { useAppSelector } from '@/src/redux/hooks';
import { logout } from '@/src/redux/slices/authSlice';
import { store } from '@/src/redux/store';
import { useLogoutMutation } from '@/src/services/auth';
import { useGetMyOrdersQuery } from '@/src/services/orderApi';
import { useGetMyPaymentsQuery } from '@/src/services/paymentApi';
import { navigate } from '@/src/utils/NavigationUtils';
import { useLocale } from '@/src/localization/useLocale';
import { useThemeColors } from '@/src/theme/useThemeColors';
import LucideIcon from '@/src/components/common/LucideIcon';
import { useTranslation } from 'react-i18next';

import { useGetMyFilesQuery } from '@/src/services/fileApi';
import { APP_VERSION } from '@/src/constants/appVersion';
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
  const { colorScheme, toggleColorScheme } = useThemeColors();
  const { user, token } = useAppSelector((state) => state.auth);
  const [activeConfirm, setActiveConfirm] = useState<'logout' | null>(null);
  const [logoutRequest, { isLoading: isLoggingOut }] = useLogoutMutation();

  const { data: filesResponse } = useGetMyFilesQuery(undefined);
  const { data: orderResponse } = useGetMyOrdersQuery(undefined);
  const { data: paymentResponse } = useGetMyPaymentsQuery(undefined);

  const stats: ProfileStat[] = [
    {
      label: t('profile.orders'),
      value: orderResponse?.data?.length ?? 0,
      icon: <LucideIcon name="ClipboardList" className="text-primary" size={17} />,
      accent: 'bg-primary/15',
    },
    {
      label: t('profile.payments'),
      value: paymentResponse?.data?.length ?? 0,
      icon: <LucideIcon name="CreditCard" className="text-warning" size={17} />,
      accent: 'bg-warning/15',
    },
    {
      label: t('profile.documents'),
      value: filesResponse?.data?.length ?? 0,
      icon: <LucideIcon name="FolderOpen" className="text-destructive" size={17} />,
      accent: 'bg-destructive/15',
    },
  ];

  const handleLogout = () => setActiveConfirm('logout');

  const initials = user?.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((w: string) => w[0])
        .join('')
        .toUpperCase()
    : '?';

  return (
    <ProtectedScreen>
      <ScreenHeader title={t('profile.headerTitle')} showBack={false} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}>
        {/* ── User Card ─────────────────────────────────────────────────── */}
        {token ? (
          <View className="mx-4 mt-2 overflow-hidden rounded-3xl border border-border bg-card">
            {/* Green accent strip */}
            <View className="h-2 w-full bg-primary" />

            <View className="px-4 pb-4 pt-4">
              <View className="flex-row items-center">
                {/* Avatar */}
                <View className="h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-primary/20">
                  <AppText className="text-lg font-bold text-primary">{initials}</AppText>
                </View>

                <View className="ml-3 flex-1">
                  <AppText className="text-base font-bold text-foreground">{user?.name}</AppText>
                  <AppText className="mt-0.5 text-xs text-mutedForeground">{user?.email}</AppText>
                  <AppText className="text-xs text-mutedForeground">{user?.mobile}</AppText>
                </View>

                {/* Status badge */}
                <View className="rounded-full border border-primary/50 bg-primary/10 px-3 py-1">
                  <AppText className="text-xs font-bold capitalize text-primary">
                    {user?.status}
                  </AppText>
                </View>
              </View>
            </View>
          </View>
        ) : (
          /* ── Guest Card ─────────────────────────────────────────────── */
          <View className="mx-4 mt-2 rounded-3xl border border-border bg-card px-4 py-5">
            <View className="mb-3 h-14 w-14 items-center justify-center rounded-full border border-border bg-muted">
              <LucideIcon name="User" className="text-mutedForeground" size={24} />
            </View>
            <AppText className="text-base font-bold text-foreground">
              {t('profile.notSignedIn')}
            </AppText>
            <AppText className="mt-1 text-xs leading-5 text-mutedForeground">
              {t('profile.notSignedInDesc')}
            </AppText>

            <TouchableOpacity
              className="mt-4 h-10 items-center justify-center rounded-2xl bg-primary"
              activeOpacity={0.85}
              onPress={() => navigate('Auth', { screen: 'SignIn', shouldGoBack: true })}>
              <AppText className="text-sm font-bold text-primaryForeground">
                {t('profile.signIn')}
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-2.5 h-10 items-center justify-center rounded-2xl border border-border bg-muted"
              activeOpacity={0.8}
              onPress={() => navigate('Auth', { screen: 'SignUp' })}>
              <AppText className="text-sm font-semibold text-foreground">
                {t('profile.createAccount')}
              </AppText>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Stats ─────────────────────────────────────────────────────── */}
        {token && (
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
            icon={<LucideIcon name="CreditCard" className="text-warning" size={16} />}
            accent="bg-warning/15"
            label={t('profile.payments')}
            description={t('profile.paymentHistory')}
            onPress={() => navigate('MyPayments')}
          />
          <MenuItem
            icon={<LucideIcon name="ClipboardList" className="text-primary" size={16} />}
            accent="bg-primary/15"
            label={t('profile.orders')}
            description={t('profile.taxOrders')}
            onPress={() => navigate('MyOrders')}
          />
          <MenuItem
            icon={<LucideIcon name="FilesIcon" className="text-chart4" size={16} />}
            accent="bg-chart4/15"
            label={t('profile.myFiles')}
            description={t('profile.myFilesDesc')}
            onPress={() => navigate('MyFiles')}
          />
        </View>

        {/* ── Info & Support ────────────────────────────────────────────── */}
        <SectionLabel label={t('profile.infoSupport')} />
        <View className="mx-4 overflow-hidden rounded-2xl border border-border bg-card">
          <MenuItem
            isFirst
            icon={<LucideIcon name="BookOpen" className="text-warning" size={16} />}
            accent="bg-warning/15"
            label={t('profile.aboutUs')}
            description={t('profile.aboutUsDesc')}
            onPress={() => navigate('AboutUs')}
          />
          <MenuItem
            icon={<LucideIcon name="Phone" className="text-secondary" size={16} />}
            accent="bg-secondary/15"
            label={t('profile.contactUs')}
            description={t('profile.contactUsDesc')}
            onPress={() => navigate('ContactUs')}
          />
          <MenuItem
            icon={<LucideIcon name="Languages" className="text-chart1" size={16} />}
            accent="bg-chart1/15"
            label={t('profile.language')}
            description={isEnglish ? 'English' : 'বাংলা'}
            onPress={() => setLocale(isEnglish ? 'bn' : 'en')}
          />
          <MenuItem
            icon={
              <LucideIcon
                name={colorScheme === 'dark' ? 'Sun' : 'Moon'}
                size={16}
                className="text-foreground"
              />
            }
            accent="bg-muted"
            label={t('profile.theme')}
            description={colorScheme === 'dark' ? t('profile.dark') : t('profile.light')}
            onPress={toggleColorScheme}
          />
        </View>

        {/* ── Account Actions ───────────────────────────────────────────── */}
        <SectionLabel label={t('profile.account')} />
        <View className="mx-4 overflow-hidden rounded-2xl border border-border bg-card">
          {token ? (
            <TouchableOpacity
              onPress={handleLogout}
              activeOpacity={0.75}
              className="flex-row items-center gap-3 px-4 py-3.5">
              <View className="h-9 w-9 items-center justify-center rounded-xl bg-muted">
                <LucideIcon name="LogOut" className="text-mutedForeground" size={16} />
              </View>
              <AppText className="flex-1 text-sm font-semibold text-foreground">
                {t('profile.signOut')}
              </AppText>
              <LucideIcon name="ChevronRight" className="text-mutedForeground" size={15} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => navigate('Auth', { screen: 'SignIn', shouldGoBack: true })}
              activeOpacity={0.75}
              className="flex-row items-center gap-3 px-4 py-3.5">
              <View className="h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
                <LucideIcon name="User" className="text-primary" size={16} />
              </View>
              <AppText className="flex-1 text-sm font-semibold text-foreground">
                {t('profile.signIn')}
              </AppText>
              <LucideIcon name="ChevronRight" className="text-mutedForeground" size={15} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── App Version ───────────────────────────────────────────────── */}
        <AppText className="mt-6 text-center text-xs text-mutedForeground">
          {t('profile.version', { version: APP_VERSION })}
        </AppText>
      </ScrollView>

      <ConfirmModal
        visible={activeConfirm === 'logout'}
        title={t('profile.signOut')}
        message={t('profile.signOutConfirm')}
        confirmLabel={t('profile.signOut')}
        cancelLabel={t('common.cancel')}
        destructive
        isLoading={isLoggingOut}
        onConfirm={async () => {
          // Clears the httpOnly refresh-token cookie server side. Without it the
          // device keeps a valid session that /auth/refresh-token would happily
          // trade for a new access token after the local state was wiped.
          // A failure here must not strand the user in a signed-in shell, so the
          // local logout runs either way.
          try {
            await logoutRequest(undefined).unwrap();
          } catch {
            // ignore — offline or already-expired session
          }
          store.dispatch(logout());
          setActiveConfirm(null);
        }}
        onCancel={() => setActiveConfirm(null)}
      />
    </ProtectedScreen>
  );
};

export default ProfileScreen;
