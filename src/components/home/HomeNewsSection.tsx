import { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Newspaper } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Marquee from '../global/Marquee';
import { useGetAllNewsQuery } from '@/src/services/publicApi';
import { navigate } from '@/src/utils/NavigationUtils';
import { useTranslation } from 'react-i18next';

const PulseDot = () => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(0.3, { duration: 700 }), withTiming(1, { duration: 700 })),
      -1,
      false
    );
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={style} className="h-1.5 w-1.5 rounded-full bg-white" />;
};

const HomeNewsSection = () => {
  const { t } = useTranslation();
  const { data } = useGetAllNewsQuery();
  const handleNavigateToNewDetails = (id: string) => {
    navigate('NewsDetails', { newsId: id });
  };

  if (!data?.data?.length) return null;

  return (
    <View className="mt-3 flex-row items-stretch overflow-hidden border border-border bg-card">
      <View className="flex-row items-center gap-1.5 bg-secondary px-3">
        <Newspaper color="#ffffff" size={14} />
        <Text className="text-xs font-semibold text-white">{t('home.news')}</Text>
        <PulseDot />
      </View>

      <View className="flex-1 justify-center py-2">
        <Marquee speed={40}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {data.data.map((item, index) => (
              <View key={item._id ?? index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Pressable
                  onPress={() => {
                    item?._id && handleNavigateToNewDetails(item._id);
                  }}>
                  <Text className="font-medium capitalize text-foreground">{item.title}</Text>
                </Pressable>
                <Text className="text-secondary">
                  {index < data.data.length - 1 ? '          ◆          ' : '          '}
                </Text>
              </View>
            ))}
          </View>
        </Marquee>
      </View>
    </View>
  );
};

export default HomeNewsSection;
