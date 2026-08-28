export const formatAmount = (amount: number) => `৳ ${amount.toLocaleString('en-BD')}`;

export const formatDate = (dateStr?: string) => {
  if (!dateStr) return '\u2014';
  return new Date(dateStr).toLocaleDateString('en-BD', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatStatus = (status: string) =>
  status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export const shortenId = (id: string) => `\u2026${id.slice(-6)}`;

export const getPayableFeeAmount = (order: {
  fee_amount?: number;
  applied_coupon?: { discount_amount?: number };
}) =>
  Math.max(0, Number(order?.fee_amount || 0) - Number(order?.applied_coupon?.discount_amount || 0));

export const getAppliedCoupon = <T extends { code?: string }>(appliedCoupon?: T) =>
  appliedCoupon?.code ? appliedCoupon : undefined;
