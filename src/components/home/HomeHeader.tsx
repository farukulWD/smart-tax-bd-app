import { View, Text, TouchableOpacity } from 'react-native';
import { BellIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppNavigation } from '@/src/utils/NavigationUtils';
import { useAppSelector } from '@/src/redux/hooks';
import { useGetUnreadCountQuery } from '@/src/services/notificationApi';

const HomeHeader = () => {
  const { top } = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const { user } = useAppSelector((state) => state.auth);
  const { data: unreadData } = useGetUnreadCountQuery();
  const unreadCount = unreadData?.data?.count ?? 0;
  return (
    <View
      style={{ paddingTop: top + 20 }}
      className="relative justify-center overflow-hidden bg-primary px-5">
      <View className="mb-3 flex-row items-center justify-between">
        <View className="h-12 w-12"></View>
        <View className="">
          <Text
            className="text-center text-4xl font-black text-white"
            style={{ fontFamily: 'serif', letterSpacing: -0.5 }}>
            Smart Tax BD
          </Text>
          <Text className="text-center font-medium tracking-wide text-secondaryForeground">
            Your Smart Tax Companion
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Notification')}
          activeOpacity={0.7}
          className="relative h-14 w-14 items-center justify-center px-2 py-1">
          <BellIcon color={'white'} />
          {unreadCount > 0 ? (
            <View className="absolute right-1 top-1 rounded-full bg-secondary px-1">
              <Text className="text-xs font-extrabold leading-tight text-secondaryForeground">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      {user?.name ? (
        <Text className="mb-4 text-center text-2xl font-bold text-primaryForeground">
          {user.name}
        </Text>
      ) : null}

      {/* <TouchableOpacity
        onPress={() => setBalanceVisible((v) => !v)}
        activeOpacity={0.85}
        className="flex-row items-center self-center rounded-full bg-white px-2 py-1.5">
        <View className="mr-2.5 h-6 w-6 items-center justify-center rounded-full bg-primary">
          <Wallet size={12} color="white" strokeWidth={2.5} />
        </View>

        <Text className="text-base font-bold text-gray-800">
          {balanceVisible ? '৳ 1,240.50' : 'Tap for Balance'}
        </Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default HomeHeader;
