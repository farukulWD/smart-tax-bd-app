import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenHeaderProps {
  title: string;
  onPress?: () => void;
  showBack?: boolean;
  className?: string;
  rightButton?: {
    icon: React.ReactNode;
    onPress: () => void;
  };
}

const ScreenHeader = ({ title, onPress, showBack = true, className, rightButton }: ScreenHeaderProps) => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  const handleBack = () => {
    if (onPress) {
      onPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View
      style={{ paddingTop: top }}
      className={cn('flex-row items-center justify-between gap-2 bg-primary px-4', className)}>
      {showBack ? (
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          className="mr-1 h-12 w-12 items-center justify-center">
          <ArrowLeftIcon size={35} color="#FFFFFF" />
        </TouchableOpacity>
      ) : (
        <View className="h-12 w-12" />
      )}
      <Text className="text-2xl font-bold tracking-tight text-white">{title}</Text>
      {rightButton ? (
        <TouchableOpacity
          onPress={rightButton.onPress}
          activeOpacity={0.7}
          className="h-12 w-12 items-center justify-center">
          {rightButton.icon}
        </TouchableOpacity>
      ) : (
        <View className="h-12 w-12" />
      )}
    </View>
  );
};

export default ScreenHeader;
