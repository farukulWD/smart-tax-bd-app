import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated';
import { WifiOff } from 'lucide-react-native';
import AppText from '@/src/components/common/AppText';
import { useAppSelector } from '@/src/redux/hooks';
import { useThemeColors } from '@/src/theme/useThemeColors';

const OfflineBanner = () => {
  const isOnline = useAppSelector((state) => state.network.isOnline);
  const { top } = useThemeColors();

  if (isOnline) return null;

  return (
    <Animated.View
      entering={SlideInUp}
      exiting={SlideOutUp}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      accessibilityLabel="No internet connection"
      className="absolute left-0 right-0 top-0 z-50 flex-row items-center justify-center gap-2 bg-destructive px-4 pb-3"
      style={{ paddingTop: top + 8 }}>
      <WifiOff size={16} color="hsl(0, 0%, 100%)" />
      <AppText className="text-sm font-semibold text-destructiveForeground">
        No internet connection
      </AppText>
    </Animated.View>
  );
};

export default OfflineBanner;
