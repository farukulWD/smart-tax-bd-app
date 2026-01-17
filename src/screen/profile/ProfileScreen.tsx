import { navigate } from '@/src/utils/NavigationUtils';
import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ProfileStat = { label: string; value: string };
type ProfileLink = { label: string; hint?: string; onPress?: () => void };

const ProfileScreen = () => {
  // Toggle this based on auth state
  const isLoggedIn = false;

  const user = {
    name: 'Mahmud Hasan',
    phone: '+880 1XXXXXXXXX',
    email: 'mahmud@example.com',
    tin: '12XXXXXXXXX',
    location: 'Dhaka, Bangladesh',
    plan: 'Free',
  };

  const stats: ProfileStat[] = [
    { label: 'Returns', value: '0' },
    { label: 'Drafts', value: '2' },
    { label: 'Payments', value: '0' },
  ];

  const links: ProfileLink[] = [
    { label: 'Personal information', hint: 'Name, contact, address' },
    { label: 'Tax information', hint: 'E-TIN, assessment year' },
    { label: 'Security', hint: 'Password, PIN, biometrics' },
    { label: 'Notifications', hint: 'Push, email preferences' },
    { label: 'Help & support', hint: 'FAQ, contact us' },
    { label: 'About', hint: 'Version, terms, privacy' },
  ];

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 12 }}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-3 pt-3">
          <Text className="text-base font-bold text-foreground">Profile</Text>
          <Text className="mt-1 text-xs text-mutedForeground">
            Manage your account and preferences
          </Text>
        </View>

        {/* Auth Card */}
        <View className="mx-3 mt-3 rounded-2xl border border-border bg-card px-3 py-3">
          {isLoggedIn ? (
            <>
              <View className="flex-row items-center">
                {/* Avatar */}
                <View className="roundedFull h-12 w-12 items-center justify-center bg-muted">
                  <Text className="text-base font-bold text-foreground">
                    {user.name
                      .split(' ')
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join('')
                      .toUpperCase()}
                  </Text>
                </View>

                <View className="ml-3 flex-1">
                  <Text className="text-base font-semibold text-foreground">{user.name}</Text>
                  <Text className="mt-1 text-xs text-mutedForeground">{user.email}</Text>
                  <Text className="mt-1 text-xs text-mutedForeground">{user.phone}</Text>
                </View>

                {/* Plan */}
                <View className="roundedFull bg-muted px-3 py-1">
                  <Text className="text-xs font-semibold text-foreground">{user.plan}</Text>
                </View>
              </View>

              {/* Quick Info */}
              <View className="mt-3 rounded-xl bg-muted px-3 py-2">
                <View className="flex-row justify-between">
                  <Text className="text-xs text-mutedForeground">E-TIN</Text>
                  <Text className="text-xs font-semibold text-foreground">{user.tin}</Text>
                </View>
                <View className="mt-2 flex-row justify-between">
                  <Text className="text-xs text-mutedForeground">Location</Text>
                  <Text className="text-xs font-semibold text-foreground">{user.location}</Text>
                </View>
              </View>

              {/* CTA */}
              <Pressable
                className="mt-3 items-center rounded-xl bg-primary px-3 py-3"
                onPress={() => {}}>
                <Text className="text-primary-foreground text-sm font-semibold">Edit profile</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text className="text-base font-bold text-foreground">You’re not signed in</Text>
              <Text className="mt-1 text-xs text-mutedForeground">
                Sign in to sync your data, save drafts, and manage tax info.
              </Text>

              <Pressable
                className="mt-3 items-center rounded-xl bg-primary px-3 py-3"
                onPress={() => {
                  navigate('Auth', { screen: 'SignIn' });
                }}>
                <Text className="text-primary-foreground text-sm font-semibold">Sign in</Text>
              </Pressable>

              <Pressable
                className="mt-3 items-center rounded-xl bg-muted px-3 py-3"
                onPress={() => {
                  navigate('Auth', { screen: 'SignUp' });
                }}>
                <Text className="text-sm font-semibold text-foreground">Create account</Text>
              </Pressable>
            </>
          )}
        </View>

        {/* Stats (only when logged in) */}
        {isLoggedIn ? (
          <View className="mx-3 mt-3 flex-row gap-3">
            {stats.map((s) => (
              <View
                key={s.label}
                className="flex-1 rounded-xl border border-border bg-card px-3 py-3">
                <Text className="text-base font-bold text-foreground">{s.value}</Text>
                <Text className="mt-1 text-xs text-mutedForeground">{s.label}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Settings */}
        <View className="mx-3 mt-3 rounded-2xl border border-border bg-card">
          <View className="px-3 py-3">
            <Text className="text-sm font-semibold text-foreground">Settings</Text>
            <Text className="mt-1 text-xs text-mutedForeground">
              Account, security, and app preferences
            </Text>
          </View>

          <View className="h-[1px] bg-border" />

          {links.map((row, idx) => (
            <Pressable key={row.label} className="px-3 py-3" onPress={row.onPress ?? (() => {})}>
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-sm font-semibold text-foreground">{row.label}</Text>
                  {!!row.hint && (
                    <Text className="mt-1 text-xs text-mutedForeground">{row.hint}</Text>
                  )}
                </View>
                <Text className="text-base text-mutedForeground">›</Text>
              </View>

              {idx !== links.length - 1 ? <View className="mt-3 h-[1px] bg-border" /> : null}
            </Pressable>
          ))}
        </View>

        {/* Account actions */}
        <View className="mx-3 mt-3 rounded-2xl border border-border bg-card px-3 py-3">
          <Text className="text-sm font-semibold text-foreground">Account</Text>

          {isLoggedIn ? (
            <>
              <Pressable className="mt-3 rounded-xl bg-muted px-3 py-3" onPress={() => {}}>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-semibold text-foreground">Sign out</Text>
                  <Text className="text-base text-mutedForeground">›</Text>
                </View>
              </Pressable>

              <Pressable
                className="mt-3 rounded-xl border border-destructive bg-card px-3 py-3"
                onPress={() => {}}>
                <Text className="text-sm font-semibold text-destructive">Delete account</Text>
                <Text className="mt-1 text-xs text-mutedForeground">This can’t be undone.</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable className="mt-3 rounded-xl bg-muted px-3 py-3" onPress={() => {}}>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-semibold text-foreground">Sign in</Text>
                  <Text className="text-base text-mutedForeground">›</Text>
                </View>
              </Pressable>

              <Text className="mt-2 text-xs text-mutedForeground">
                You can still browse settings without signing in.
              </Text>
            </>
          )}
        </View>

        {/* App meta */}
        <View className="mx-3 mt-3 rounded-xl bg-muted px-3 py-2">
          <Text className="text-center text-xs text-mutedForeground">App version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
