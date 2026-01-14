// src/components/CustomTabBar.tsx
import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, Platform, Dimensions, Vibration } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { CircleQuestionMark, Home, LayoutGrid, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { gGap } from '../utils/Sizes';
import { Colors, NAV_THEME, THEME } from '@/lib/theme';
import { cn, getMode } from '@/lib/utils';
import { useTheme } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

interface TabIconProps {
  routeName: string;
  isFocused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ routeName, isFocused }) => {
  const colors = THEME[getMode()];
  console.log('colors', JSON.stringify(colors, null, 2));
  const iconColor = isFocused ? colors.primary : colors.mutedForeground;
  const getIconContent = () => {
    switch (routeName) {
      case 'HomeStack':
        return <Home size={20} color={iconColor} />;
      case 'DocumentStack':
        return <LayoutGrid size={20} color={iconColor} />;
      case 'FAQStack':
        return <CircleQuestionMark size={20} color={iconColor} />;
      case 'ProfileStack':
        return <User size={20} color={iconColor} />;
      default:
        return (
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 8,
              backgroundColor: iconColor,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 4,
            }}>
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: iconColor,
                borderRadius: 2,
              }}
            />
          </View>
        );
    }
  };

  const getTabLabel = () => {
    switch (routeName) {
      case 'HomeStack':
        return 'Home';
      case 'DocumentStack':
        return 'Docs';
      case 'FAQStack':
        return 'FAQ';
      case 'ProfileStack':
        return 'Profile';
      default:
        return routeName;
    }
  };

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {getIconContent()}
      <Text
        className={cn('font-okra font-semibold', isFocused ? 'text-foreground' : 'text-primary')}
        style={{
          fontSize: 10,
          color: iconColor,
        }}>
        {getTabLabel()}
      </Text>
    </View>
  );
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const tabWidth = screenWidth / state.routes.length;
  const indicatorPosition = useSharedValue(0);
  const indicatorOpacity = useSharedValue(0);
  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    indicatorPosition.value = withSpring(state.index * tabWidth, {
      damping: 60,
      stiffness: 400,
    });

    indicatorOpacity.value = withTiming(1, { duration: 300 });
  }, [indicatorOpacity, indicatorPosition, state.index, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorPosition.value }],
    opacity: indicatorOpacity.value,
  }));

  const triggerVibration = () => {
    if (Platform.OS === 'android') {
      Vibration.vibrate(50);
    }
  };

  return (
    <View
      className="bg-background"
      style={{
        flexDirection: 'row',
        paddingBottom: gGap(bottom / 2) + gGap(5),
        paddingTop: gGap(5),
        borderTopWidth: 1,
        borderTopColor: Colors.border,
      }}>
      {/* Animated Indicator */}
      <Animated.View
        style={[
          indicatorStyle,
          {
            position: 'absolute',
            bottom: gGap(bottom / 2),
            width: tabWidth * 0.6,
            marginLeft: tabWidth * 0.2,
            height: 3,
            backgroundColor: Colors.primary,
            borderRadius: 1.5,
          },
        ]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const handlePress = () => {
          runOnJS(triggerVibration)();

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const handleLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={handlePress}
            onLongPress={handleLongPress}
            style={{
              width: screenWidth / state.routes.length,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            activeOpacity={0.7}>
            <TabIcon routeName={route.name} isFocused={isFocused} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
