import { Dimensions } from 'react-native';
import { FONT_SIZES, SPACING, varName } from '../../design-tokens';

/**
 * Device sizing.
 *
 * `tailwind.config.js` runs in Node at build time and cannot read `Dimensions`,
 * so the `text-*` and spacing scales are declared there as `var(--fs-*)` /
 * `var(--sp-*)` and the real numbers are injected at runtime by `ThemedApp` —
 * the same trick the colors already use.
 *
 * The factor keys off the *smaller* of the two axis ratios. Height is what
 * actually separates a cramped phone from a comfortable one: a 360x640dp
 * device has only 6% less width than a 384x853dp one but 25% less height, so a
 * width-only scale cannot see the difference at all.
 */

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// `screen`, not `window`: window subtracts the system bars, and nav-bar style
// varies per device — a phone with a 3-button bar would otherwise read as
// smaller than an identical one using gesture navigation.
const { width, height } = Dimensions.get('screen');

// Capped at 1, so big phones and tablets keep the design sizes exactly. Only
// devices smaller than the reference shrink.
const raw = Math.min(1, width / BASE_WIDTH, height / BASE_HEIGHT);

// Type is dampened harder than layout: padding can afford to tighten more than
// a 10px label can afford to shrink.
export const fontFactor = Math.max(0.85, 1 + (raw - 1) * 0.5);
export const spaceFactor = Math.max(0.82, 1 + (raw - 1) * 0.85);

export const scaleFont = (size: number) => Math.round(size * fontFactor);

/** Floored at 1 so a 2px divider cannot round away to nothing. */
export const scaleSpace = (size: number) => Math.max(1, Math.round(size * spaceFactor));

export const screenWidth = width;
export const screenHeight = height;

const toVars = (prefix: string, table: Record<string, number>, scale: (n: number) => number) =>
  Object.fromEntries(
    Object.entries(table).map(([key, size]) => [varName(prefix, key), scale(size)])
  );

/** `{ 'fs-base': 14, 'sp-4': 13, ... }` — ready to spread into `vars()`. */
export const scaleVars = {
  ...toVars('fs', FONT_SIZES, scaleFont),
  ...toVars('sp', SPACING, scaleSpace),
};
