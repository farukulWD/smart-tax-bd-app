import { View, Text, Pressable } from 'react-native';
import { FilePlus2, ClipboardList } from 'lucide-react-native';
import { navigate, navigateToStack } from '@/src/utils/NavigationUtils';

const HomeQuickActions = () => (
  <View className="flex-row gap-3 px-4">
    {/* Start Filing — red card */}
    <Pressable
      onPress={() => navigate('CreateTaxOrder', { taxType: '' })}
      className="flex-1 rounded-2xl bg-primary p-4">
      <View className="mb-6 h-11 w-11 items-center justify-center rounded-xl bg-white/20">
        <FilePlus2 color="#ffffff" size={22} />
      </View>
      <Text className="text-lg font-bold text-white">Start Filing</Text>
      <Text className="text-sm text-white/80">New tax return</Text>
    </Pressable>

    {/* Track Status — white card */}
    <Pressable
      onPress={() => navigateToStack('ProfileStack', { screen: 'MyOrders' })}
      className="flex-1 rounded-2xl border border-border bg-card p-4">
      <View className="mb-6 h-11 w-11 items-center justify-center rounded-xl bg-muted">
        <ClipboardList color="#258336" size={22} />
      </View>
      <Text className="text-lg font-bold text-foreground">Track Status</Text>
      <Text className="text-sm text-mutedForeground">View your filings</Text>
    </Pressable>
  </View>
);

export default HomeQuickActions;
