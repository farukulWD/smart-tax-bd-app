import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { cn } from '@/lib/utils';

interface ScreenHeaderProps {
  title: string;
  description?: string;
  onPress?: () => void;
  showBack?: boolean;
  icon?: React.ReactNode;
  className: string;
}

const ScreenHeader = ({
  title,
  description,
  onPress,
  showBack = true,
  icon,
  className,
}: ScreenHeaderProps) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onPress) {
      onPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View className={cn('flex-row items-center gap-2 px-4', className)}>
      {showBack && (
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          className="mr-1 h-12 w-12 items-center justify-center rounded-full border border-border bg-muted">
          <ArrowLeft size={25} color="hsl(125, 70%, 33%)" />
        </TouchableOpacity>
      )}
      <View>
        <Text className="text-2xl font-bold tracking-tight text-foreground">{title}</Text>
        {description && <Text className={`text-sm text-mutedForeground`}>{description}</Text>}
      </View>
    </View>
  );
};

export default ScreenHeader;
