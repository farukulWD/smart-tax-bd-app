import { View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PressableScale } from './PressableScale';
import { LucideArrowLeft } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { Text } from '@/components/ui/text';
import { goBack } from '@/src/utils/NavigationUtils';

const TitleHeader = ({ title, onPress }: { onPress?: () => void; title: string }) => {
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: top,
      }}
      className="flex-row items-center border-b border-b-border bg-accent">
      <PressableScale
        onPress={() => {
          onPress ? onPress() : goBack();
        }}
        className="mb-3 w-12 items-center justify-center">
        <LucideArrowLeft size={25} color={Colors.foreground} strokeWidth={3} />
      </PressableScale>
      <Text variant={'lead'} className="mb-3 font-bold text-foreground">
        {title}
      </Text>
    </View>
  );
};

export default TitleHeader;
