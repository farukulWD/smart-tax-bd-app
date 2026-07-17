import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { AppStackParamList } from '@/src/navigation/AppStack';
import { HAS_SEEN_ONBOARDING } from '@/src/utils/onboarding';
import { StatusBar } from 'expo-status-bar';
import { Images } from '@/src/utils/Images';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

const onboardingData = [
  {
    title: 'Simplify Your Tax Filing',
    description: 'File your income tax return in minutes, right from your phone.',
  },
  {
    title: 'Every Income Type Covered',
    description: 'From salary to rental to agriculture\u2014we handle every category of income.',
  },
  {
    title: 'Track Every Step',
    description: "Follow your filing status and get reminders until it's done.",
  },
];

const OnboardingScreen = () => {
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList<(typeof onboardingData)[0]>>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const navigation = useNavigation<NavigationProp>();

  const isLastPage = currentPage === onboardingData.length - 1;

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(HAS_SEEN_ONBOARDING, 'true');
    navigation.reset({
      index: 0,
      routes: [{ name: 'BottomTabNavigator' }],
    });
  }, [navigation]);

  const handleNext = useCallback(() => {
    if (isLastPage) {
      completeOnboarding();
    } else {
      flatListRef.current?.scrollToIndex({ index: currentPage + 1, animated: true });
    }
  }, [isLastPage, currentPage, completeOnboarding]);

  const handleSkip = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const page = Math.round(e.nativeEvent.contentOffset.x / width);
      setCurrentPage(page);
    },
    [width]
  );

  const renderItem = useCallback(
    ({ item }: { item: (typeof onboardingData)[0] }) => (
      <View style={{ width }} className="flex-1 items-center justify-center px-10">
        <View className="h-40 w-40">
          <Image source={Images.LOGO_SMALL} className="h-full w-full" />
        </View>
        <View className="mt-12 items-center">
          <Text className="text-center text-2xl font-bold text-foreground">{item.title}</Text>
          <Text className="text-mutedForeground mt-3 text-center text-base leading-6">
            {item.description}
          </Text>
        </View>
      </View>
    ),
    [width]
  );

  return (
    <SafeAreaView className="relative flex-1 bg-background">
      <StatusBar style={'dark'} backgroundColor="transparent" />
      <View>
        {!isLastPage && (
          <TouchableOpacity onPress={handleSkip} className="absolute right-6 top-4 z-10">
            <Text className="text-base font-medium text-foreground">Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Pages */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* Bottom section */}
      <View className="px-8 pb-8">
        {/* Pagination dots */}
        <View className="mb-6 flex-row items-center justify-center gap-2">
          {onboardingData.map((_, i) => (
            <View
              key={i}
              className={cn(
                'rounded-full',
                i === currentPage ? 'h-2.5 w-8 bg-primary' : 'h-2 w-2 bg-primary/20'
              )}
            />
          ))}
        </View>

        {/* CTA Button */}
        <Button size="lg" onPress={handleNext} className="w-full rounded-full bg-primary">
          <Text>{isLastPage ? 'Get Started' : 'Next'}</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
