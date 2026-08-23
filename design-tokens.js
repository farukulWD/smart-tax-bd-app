// Base, unscaled design sizes in px.
//
// Read at build time by `tailwind.config.js` (as the fallback baked into each
// `var()`) and at runtime by `src/utils/scale.ts` (as the values the device
// scale factors multiply). Plain CommonJS so both sides can require it — the
// runtime must never reach for `tailwindcss/defaultTheme`, that would drag
// Tailwind into the app bundle.

const FONT_SIZES = {
  10: 10,
  11: 11,
  13: 13,
  15: 15,
  17: 17,
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

// Tailwind's default spacing scale, in px (its rem values × the 16 configured
// as `inlineRem` in metro.config.js). Every key has to be here: a missing one
// silently keeps its static rem value while everything around it scales.
// `0` and `px` are deliberately absent — zero stays zero and the 1px hairline
// must not scale.
const SPACING = {
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  // Not a stock Tailwind step — the tax category card's floor. Added here so
  // `min-h-26` scales with everything else instead of being a frozen
  // `min-h-[104px]` bracket value.
  26: 104,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
};

// `.` is not a valid character in a CSS custom-property ident: `3.5` -> `sp-3_5`.
const varName = (prefix, key) => `${prefix}-${String(key).replace('.', '_')}`;

module.exports = { FONT_SIZES, SPACING, varName };
