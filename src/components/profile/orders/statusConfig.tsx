import React from 'react';
import { FileText, Clock, CheckCircle2, CircleDot } from 'lucide-react-native';
import type { TFunction } from 'i18next';
import type { lightColors } from '@/src/theme/colors';

type ThemeColors = typeof lightColors;

export type StatusConfig = {
  label: string;
  pillBg: string;
  pillText: string;
  borderAccent: string;
  iconColor: string;
  icon: React.ReactNode;
};

type StatusStyle = Omit<StatusConfig, 'label'>;

const getStatusStyle = (status: string, colors: ThemeColors): StatusStyle => {
  const map: Record<string, StatusStyle> = {
    draft: {
      pillBg: 'bg-muted',
      pillText: 'text-mutedForeground',
      borderAccent: 'border-l-border',
      iconColor: colors.mutedForeground,
      icon: <FileText size={14} color={colors.mutedForeground} />,
    },
    documents_uploaded: {
      pillBg: 'bg-success/15',
      pillText: 'text-success',
      borderAccent: 'border-l-success',
      iconColor: colors.success,
      icon: <CheckCircle2 size={14} color={colors.success} />,
    },
    order_placed: {
      pillBg: 'bg-success/15',
      pillText: 'text-success',
      borderAccent: 'border-l-success',
      iconColor: colors.success,
      icon: <CheckCircle2 size={14} color={colors.success} />,
    },
    payment_pending: {
      pillBg: 'bg-warning/15',
      pillText: 'text-warning',
      borderAccent: 'border-l-warning',
      iconColor: colors.warning,
      icon: <Clock size={14} color={colors.warning} />,
    },
  };

  return (
    map[status] ?? {
      pillBg: 'bg-muted',
      pillText: 'text-mutedForeground',
      borderAccent: 'border-l-border',
      iconColor: colors.mutedForeground,
      icon: <CircleDot size={14} color={colors.mutedForeground} />,
    }
  );
};

const humanize = (status: string) =>
  status
    .split('_')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export const getStatusLabel = (status: string | undefined | null, t: TFunction): string => {
  if (!status) return t('orderStatuses.unknown');
  return t(`orderStatuses.${status}`, { defaultValue: humanize(status) });
};

export const getStatusConfig = (
  status: string,
  colors: ThemeColors,
  t: TFunction
): StatusConfig => ({
  label: getStatusLabel(status, t),
  ...getStatusStyle(status, colors),
});
