import React from 'react';
import { View, Text } from 'react-native';

type NoDataProps = {
  title?: string;
  message?: string;
  compact?: boolean; // tighter spacing if used inside cards/sheets
};

const NoData: React.FC<NoDataProps> = ({
  title = 'No data available',
  message = 'Try again later or adjust your filters.',
  compact = false,
}) => {
  return (
    <View
      className={[
        'w-full items-center justify-center rounded-xl border border-border bg-card px-3',
        compact ? 'py-3' : 'py-4',
      ].join(' ')}>
      {/* Icon */}
      <View className="h-10 w-10 items-center justify-center rounded-full bg-muted">
        <Text className="text-[18px]">📭</Text>
      </View>

      {/* Text */}
      <Text className="mt-2 text-2xl font-semibold text-foreground">{title}</Text>
      <Text className="mt-1 text-center text-[12px] leading-4 text-mutedForeground">{message}</Text>
    </View>
  );
};

export default NoData;

/**
 * Usage:
 *
 * <View className="flex-1 bg-background px-3 pt-3">
 *   <NoData />
 * </View>
 *
 * <NoData
 *   title="No FAQs found"
 *   message="Clear search or try a different keyword."
 *   compact
 * />
 */
