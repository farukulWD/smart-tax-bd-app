import React from 'react';
import { FileText, Clock, CheckCircle2, CircleDot } from 'lucide-react-native';
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

export const getStatusConfig = (status: string, colors: ThemeColors): StatusConfig => {
  const map: Record<string, StatusConfig> = {
    draft: {
      label: 'Draft',
      pillBg: 'bg-muted',
      pillText: 'text-mutedForeground',
      borderAccent: 'border-l-border',
      iconColor: colors.mutedForeground,
      icon: <FileText size={14} color={colors.mutedForeground} />,
    },
    documents_uploaded: {
      label: 'Docs Uploaded',
      pillBg: 'bg-success/15',
      pillText: 'text-success',
      borderAccent: 'border-l-success',
      iconColor: colors.success,
      icon: <CheckCircle2 size={14} color={colors.success} />,
    },
    order_placed: {
      label: 'Order Placed',
      pillBg: 'bg-success/15',
      pillText: 'text-success',
      borderAccent: 'border-l-success',
      iconColor: colors.success,
      icon: <CheckCircle2 size={14} color={colors.success} />,
    },
    payment_pending: {
      label: 'Pending Payment',
      pillBg: 'bg-warning/15',
      pillText: 'text-warning',
      borderAccent: 'border-l-warning',
      iconColor: colors.warning,
      icon: <Clock size={14} color={colors.warning} />,
    },
  };

  return (
    map[status] ?? {
      label: status
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
      pillBg: 'bg-muted',
      pillText: 'text-mutedForeground',
      borderAccent: 'border-l-border',
      iconColor: colors.mutedForeground,
      icon: <CircleDot size={14} color={colors.mutedForeground} />,
    }
  );
};
