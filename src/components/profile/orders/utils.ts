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

/**
 * The service fee a customer actually owes, after any applied coupon.
 *
 * Mirrors `getPayableFeeAmount` in
 * smart-tax-bd-server/src/app/module/Tax/tax.utils.ts. Every surface that
 * renders or reasons about the fee must go through this — reading `fee_amount`
 * directly shows the undiscounted list price.
 */
export const getPayableFeeAmount = (order: {
  fee_amount?: number;
  applied_coupon?: { discount_amount?: number };
}) =>
  Math.max(0, Number(order?.fee_amount || 0) - Number(order?.applied_coupon?.discount_amount || 0));

/**
 * The coupon snapshot, or undefined when the nested path is present but empty.
 *
 * Mongoose returns `{}` for a nested path with no data, so a plain truthiness
 * check would report a coupon that isn't there.
 */
export const getAppliedCoupon = <T extends { code?: string }>(appliedCoupon?: T) =>
  appliedCoupon?.code ? appliedCoupon : undefined;
