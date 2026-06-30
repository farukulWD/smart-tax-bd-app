import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Home } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OrderSuccessScreen = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: top, paddingBottom: bottom }} className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 size={56} color="#16a34a" />
        </View>
        <Text className="mb-2 text-center text-2xl font-bold text-foreground">
          {t('order.successTitle')}
        </Text>
        <Text className="mb-10 text-center text-sm leading-5 text-mutedForeground">
          {t('order.successDescription')}
        </Text>
        <View className="w-full gap-3">
          <TouchableOpacity
            onPress={() => navigation.navigate('BottomTabNavigator', { screen: 'Home' })}
            activeOpacity={0.8}
            className="flex-row items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4">
            <Home size={18} color="#fff" />
            <Text className="text-base font-bold text-white">{t('order.goHome')}</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => navigation.navigate('BottomTabNavigator', { screen: 'Profile' })}
            activeOpacity={0.8}
            className="flex-row items-center justify-center gap-2 rounded-2xl border border-border bg-muted py-4">
            <ClipboardList size={18} color="hsl(0, 0%, 60%)" />
            <Text className="text-sm font-semibold text-mutedForeground">{t('order.goOrders')}</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
};

export default OrderSuccessScreen;
