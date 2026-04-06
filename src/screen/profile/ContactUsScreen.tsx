import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Mail, MapPin, PhoneCall } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/context/ThemeProvider';
import { navigate } from '@/src/utils/NavigationUtils';

const contactCards = [
  {
    title: 'Phone',
    value: '+880 1700-000000',
    subtext: 'Sat-Thu, 10:00 AM - 7:00 PM',
    icon: PhoneCall,
  },
  {
    title: 'Email',
    value: 'support@smarttaxbd.com',
    subtext: 'We usually reply within 24 hours',
    icon: Mail,
  },
  {
    title: 'Office',
    value: 'Dhaka, Bangladesh',
    subtext: 'Remote and in-person consultation',
    icon: MapPin,
  },
];

const ContactUsScreen = () => {
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
              Contact Smart Tax
            </Text>
          </View>

          {/* Heading */}
          <Text className="mb-4 text-center text-3xl font-extrabold leading-tight text-foreground">
            Let's discuss your tax needs
          </Text>

          {/* Subtitle */}
          <Text className="text-center text-base leading-relaxed text-mutedForeground">
            Reach out to our team for service details, onboarding support, or help with your ongoing
            tax requests.
          </Text>
        </View>

        {/* ── Contact Cards ─────────────────────────────────────────────── */}
        <View className="gap-4 px-5 pb-6">
          {contactCards.map((item) => (
            <View key={item.title} className="rounded-2xl border border-border bg-card p-5">
              {/* Icon */}
              <View className="mb-4 h-10 w-10 items-center justify-center rounded-full bg-muted">
                <item.icon size={20} color={Colors.primary} />
              </View>
              {/* Title */}
              <Text className="text-base font-semibold text-cardForeground">{item.title}</Text>
              {/* Value */}
              <Text className="mt-2 text-sm font-medium text-foreground">{item.value}</Text>
              {/* Subtext */}
              <Text className="mt-1 text-sm text-mutedForeground">{item.subtext}</Text>
            </View>
          ))}
        </View>

        {/* ── Next Steps ───────────────────────────────────────────────── */}
        <View className="mx-5 mb-12 rounded-3xl border border-border bg-card p-6">
          <Text className="text-xl font-bold text-foreground">Next Steps</Text>
          <Text className="mt-2 text-sm leading-relaxed text-mutedForeground">
            Already have an account? Create a tax order directly and we'll follow up with document
            requirements and estimated timelines.
          </Text>

          {/* CTA Buttons */}
          <View className="mt-6 flex-row flex-wrap gap-3">
            <TouchableOpacity
              onPress={() => {
                navigate('CreateTaxOrder');
              }}
              className="rounded-full bg-primary px-6 py-2.5"
              activeOpacity={0.8}>
              <Text className="text-sm font-semibold text-primaryForeground">Create Tax Order</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigate('AboutUs');
              }}
              className="rounded-full border border-primary px-6 py-2.5"
              activeOpacity={0.8}>
              <Text className="text-sm font-semibold text-primary">About Us</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContactUsScreen;
