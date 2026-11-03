import { View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { CheckCircle2, ExternalLink, Info, ShieldCheck, Users, Zap } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { navigate } from '@/src/utils/NavigationUtils';
import { BackButton } from '@/src/components/global/BackButton';

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

const officialSources = [
  { label: 'National Board of Revenue (NBR)', url: 'https://nbr.gov.bd' },
  { label: 'NBR e-Return Portal', url: 'https://etaxnbr.gov.bd' },
];

const AboutUsScreen = () => {
  const { colors } = useThemeColors();
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        <View className="px-5 pb-2 pt-2">
          <BackButton />
        </View>

        <View className="items-center px-5 py-5">
          <View className="mb-4 rounded-full border border-border bg-muted px-4 py-1">
            <Text className="text-xs font-semibold uppercase tracking-widest text-mutedForeground">
              About Smart Tax
            </Text>
          </View>

          <Text className="mb-4 text-center text-3xl font-extrabold leading-tight text-foreground">
            Helping Bangladesh stay tax-ready with clarity and confidence
          </Text>

          <Text className="text-center text-base leading-relaxed text-mutedForeground">
            Smart Tax BD combines tax expertise with a modern client experience. We simplify filing,
            documentation, and advisory support so you can focus on your work while we handle the
            complexity.
          </Text>
        </View>

        <View className="gap-4 px-5 pb-10">
          {highlights.map((item) => (
            <View
              key={item.title}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <View className="mb-4 h-10 w-10 items-center justify-center rounded-full bg-muted">
                <item.icon size={20} color={colors.primary} />
              </View>
              <Text className="text-base font-semibold text-cardForeground">{item.title}</Text>
              <Text className="mt-2 text-sm leading-relaxed text-mutedForeground">
                {item.description}
              </Text>
            </View>
          ))}
        </View>

        <View className="mx-5 mb-12 rounded-3xl border border-border bg-card p-6">
          <Text className="mb-4 text-xl font-bold text-foreground">Why clients choose us</Text>

          <View className="mb-6 gap-3">
            {whyUs.map((item, index) => (
              <View key={index} className="flex-row items-start gap-3">
                <CheckCircle2 size={20} color={colors.primary} className="mt-0.5 shrink-0" />
                <Text className="flex-1 text-sm leading-relaxed text-mutedForeground">{item}</Text>
              </View>
            ))}
          </View>

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

        <View className="mx-5 mb-12 rounded-3xl border border-border bg-card p-6">
          <View className="mb-3 flex-row items-center gap-2">
            <Info size={20} color={colors.primary} />
            <Text className="text-lg font-bold text-foreground">Disclaimer</Text>
          </View>
          <Text className="mb-5 text-sm leading-relaxed text-mutedForeground">
            Smart Tax BD is a private tax-filing service. It is not affiliated with, endorsed by, or
            representing the National Board of Revenue (NBR) or any Government of Bangladesh entity.
            Tax information in this app is based on the official sources below.
          </Text>

          <Text className="mb-3 text-sm font-semibold text-foreground">Official sources</Text>
          <View className="gap-3">
            {officialSources.map((source) => (
              <TouchableOpacity
                key={source.url}
                onPress={() => Linking.openURL(source.url)}
                className="flex-row items-center gap-3 rounded-xl border border-border px-4 py-3"
                activeOpacity={0.8}>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">{source.label}</Text>
                  <Text className="text-xs text-primary">{source.url}</Text>
                </View>
                <ExternalLink size={16} color={colors.primary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUsScreen;
