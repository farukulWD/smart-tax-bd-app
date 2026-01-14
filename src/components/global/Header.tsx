import { View, Image } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { PressableScale } from './PressableScale';
import { Bell, MessageCircle } from 'lucide-react-native';
import { Images } from '@/src/utils/Images';
import { Colors } from '@/src/context/ThemeProvider';

const Header = () => {
  const { top } = useSafeAreaInsets();

  console.log('Colors.mutedForeground', JSON.stringify(Colors.mutedForeground, null, 2));

  return (
    <View
      style={{ paddingTop: top }}
      className="flex-row items-center justify-between border-b border-b-border bg-card px-4 pb-2">
      <View className="flex-1 flex-row items-center gap-3">
        <Image className="h-16 w-16 rounded-full border border-border" source={Images.LOGO_SMALL} />

        <View className="flex-1">
          <Text numberOfLines={1} className="text-foreground" variant="large">
            Shuvajit Maitra
          </Text>

          <Text numberOfLines={1} className="text-mutedForeground" variant="muted">
            shuvajitmaitra@gmail.com
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-3">
        <PressableScale className="h-12 w-12 items-center justify-center rounded-full border border-border bg-secondary">
          <Bell size={25} color={Colors.mutedForeground} />
        </PressableScale>

        <PressableScale className="h-12 w-12 items-center justify-center rounded-full border border-border bg-secondary">
          <MessageCircle size={25} color={Colors.mutedForeground} />
        </PressableScale>
      </View>
    </View>
  );
};

export default Header;
