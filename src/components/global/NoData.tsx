import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

type NoDataProps = {
  title?: string;
  message?: string;
  compact?: boolean; // tighter spacing if used inside cards/sheets
};

const NoData: React.FC<NoDataProps> = ({ title, message, compact = false }) => {
  const { t } = useTranslation();

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
      <Text className="mt-2 text-2xl font-semibold text-foreground">
        {title || t('common.noDataTitle')}
      </Text>
      <Text className="mt-1 text-center text-[12px] leading-4 text-mutedForeground">
        {message || t('common.noDataMessage')}
      </Text>
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
