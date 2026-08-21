import { View } from 'react-native';
import AppText from '@/src/components/common/AppText';

export const StepDots = ({ current }: { current: 1 | 2 | 3 }) => (
  <View className="flex-row items-center gap-1">
    {[1, 2, 3].map((step) => (
      <View
        key={step}
        className={[
          'h-1.5 rounded-full',
          step < current
            ? 'w-4 bg-primary'
            : step === current
              ? 'w-4 bg-primary/60'
              : 'w-2 bg-muted',
        ].join(' ')}
      />
    ))}
    <AppText className="ml-1 text-xs text-mutedForeground">Step {current}/3</AppText>
  </View>
);
