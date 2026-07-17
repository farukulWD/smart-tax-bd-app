import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { BellIcon, Search } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppNavigation } from '@/src/utils/NavigationUtils';
import { useAppSelector } from '@/src/redux/hooks';
import { useGetUnreadCountQuery } from '@/src/services/notificationApi';
import { Images } from '@/src/utils/Images';

type HomeHeaderProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

const HomeHeader = ({ searchQuery, onSearchChange }: HomeHeaderProps) => {
  const { top } = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const { user } = useAppSelector((state) => state.auth);
  const { data: unreadData } = useGetUnreadCountQuery();
  const unreadCount = unreadData?.data?.count ?? 0;

  return (
    <View style={{ paddingTop: top + 20 }} className="bg-secondary/10 px-5 pb-5">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center gap-3">
          <Image source={Images.LOGO_SMALL} resizeMode="contain" className="h-12 w-12" />
          <View className="flex-1">
            <Text className="text-sm font-medium text-secondary">Welcome back</Text>
            {user?.name ? (
              <Text className="text-2xl font-bold text-foreground" numberOfLines={1}>
                {user.name}
              </Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Notification')}
          activeOpacity={0.7}
          className="relative h-12 w-12 items-center justify-center rounded-full border border-border bg-card">
          <BellIcon color="#258336" size={22} />
          {unreadCount > 0 ? (
            <View className="absolute right-1 top-1 rounded-full bg-primary px-1">
              <Text className="text-xs font-extrabold leading-tight text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      <View className="mt-4 flex-row items-center gap-2 rounded-full bg-card px-4 py-3">
        <Search color="#9CA3AF" size={20} />
        <TextInput
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search tax categories"
          placeholderTextColor="#9CA3AF"
          className="flex-1 p-0 text-base text-foreground"
        />
      </View>
    </View>
  );
};

export default HomeHeader;
