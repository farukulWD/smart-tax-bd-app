import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { CheckCircle2, ShieldCheck, Users, Zap } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/context/ThemeProvider';
import { navigate } from '@/src/utils/NavigationUtils';

const highlights = [
  {
    title: 'Expert Guidance',
    description:
      'Our tax specialists help individuals and businesses make confident tax decisions.',
    icon: Users,
  },
  {
    title: 'Trusted Compliance',
    description:
      'We keep your filings aligned with current regulations and reduce compliance risk.',
    icon: ShieldCheck,
  },
  {
    title: 'Fast Digital Workflow',
    description: 'Track requests, upload files, and manage tax orders from a single portal.',
    icon: Zap,
  },
];

const whyUs = [
  'Personalized support for salaried professionals, freelancers, and businesses.',
  'Clear process from document collection to final filing.',
  'Secure, transparent communication throughout every step.',
];

const AboutUsScreen = () => {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        {/* ── Hero Section ─────────────────────────────────────────────── */}
        <View className="items-center px-5 py-5">
          {/* Badge */}
          <View className="mb-4 rounded-full border border-border bg-muted px-4 py-1">
            <Text className="text-xs font-semibold uppercase tracking-widest text-mutedForeground">
              About Smart Tax
            </Text>
          </View>

          {/* Heading */}
          <Text className="mb-4 text-center text-3xl font-extrabold leading-tight text-foreground">
            Helping Bangladesh stay tax-ready with clarity and confidence
          </Text>

          {/* Subtitle */}
          <Text className="text-center text-base leading-relaxed text-mutedForeground">
            Smart Tax BD combines tax expertise with a modern client experience. We simplify filing,
            documentation, and advisory support so you can focus on your work while we handle the
            complexity.
          </Text>
        </View>

        {/* ── Highlights Cards ──────────────────────────────────────────── */}
        <View className="gap-4 px-5 pb-10">
          {highlights.map((item) => (
            <View
              key={item.title}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              {/* Icon */}
              <View className="mb-4 h-10 w-10 items-center justify-center rounded-full bg-muted">
                <item.icon size={20} color={Colors.primary} />
              </View>
              {/* Title */}
              <Text className="text-base font-semibold text-cardForeground">{item.title}</Text>
              {/* Description */}
              <Text className="mt-2 text-sm leading-relaxed text-mutedForeground">
                {item.description}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Why Clients Choose Us ─────────────────────────────────────── */}
        <View className="mx-5 mb-12 rounded-3xl border border-border bg-card p-6">
          <Text className="mb-4 text-xl font-bold text-foreground">Why clients choose us</Text>

          <View className="mb-6 gap-3">
            {whyUs.map((item, index) => (
              <View key={index} className="flex-row items-start gap-3">
                <CheckCircle2 size={20} color={Colors.primary} className="mt-0.5 shrink-0" />
                <Text className="flex-1 text-sm leading-relaxed text-mutedForeground">{item}</Text>
              </View>
            ))}
          </View>

          {/* CTA Buttons */}
          <View className="flex-row flex-wrap gap-3">
            <TouchableOpacity
              onPress={() => {
                navigate('CreateTaxOrder');
              }}
              className="rounded-full bg-primary px-6 py-2.5"
              activeOpacity={0.8}>
              <Text className="text-sm font-semibold text-primaryForeground">
                Start a Tax Order
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigate('ContactUs');
              }}
              className="rounded-full border border-primary px-6 py-2.5"
              activeOpacity={0.8}>
              <Text className="text-sm font-semibold text-primary">Contact Us</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUsScreen;
