// src/components/CustomTabBar.tsx
import React from 'react';
import { View, TouchableOpacity, Text, Platform, Dimensions, Vibration } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CircleQuestionMark, FileText, Home, Newspaper, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { gGap } from '../utils/Sizes';
import { cn } from '@/lib/utils';
import { useThemeColors } from '../theme/useThemeColors';
import { useTranslation } from 'react-i18next';

const { width: screenWidth } = Dimensions.get('window');

interface TabIconProps {
  routeName: string;
  isFocused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ routeName, isFocused }) => {
  const { t } = useTranslation();
  const { colors } = useThemeColors();

  const iconColor = isFocused ? colors.primary : colors.mutedForeground;
  const labelColor = isFocused ? colors.primary : colors.mutedForeground;

  const getIconContent = () => {
    switch (routeName) {
      case 'HomeStack':
        return <Home size={20} color={iconColor} />;
      case 'FilingStack':
        return <FileText size={20} color={iconColor} />;
      case 'BlogStack':
        return <Newspaper size={20} color={iconColor} />;
      case 'FAQStack':
        return <CircleQuestionMark size={20} color={iconColor} />;
      case 'ProfileStack':
        return <User size={20} color={iconColor} />;
      default:
        return <Home size={20} color={iconColor} />;
    }
  };

  const getTabLabel = () => {
    switch (routeName) {
      case 'HomeStack':
        return t('common.tabHome');
      case 'FilingStack':
        return t('common.tabFiling');
      case 'BlogStack':
        return t('common.tabBlogs');
      case 'FAQStack':
        return t('common.tabFaq');
      case 'ProfileStack':
        return t('common.tabProfile');
      default:
        return routeName;
    }
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          height: 24,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {getIconContent()}
      </View>
      <Text
        className={cn('font-okra font-semibold')}
        style={{
          fontSize: 10,
          marginTop: 2,
          color: labelColor,
        }}>
        {getTabLabel()}
      </Text>
    </View>
  );
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { colors } = useThemeColors();
  const { bottom } = useSafeAreaInsets();

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
        paddingBottom: bottom,
        paddingTop: gGap(5),
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const handlePress = () => {
          triggerVibration();

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
