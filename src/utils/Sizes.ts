import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;
const scaleSize = (size: number) => (width / BASE_WIDTH) * size;
const verticalScaleSize = (size: number) => (height / BASE_HEIGHT) * size;
const responsiveFontSize = (size: number) => {
  const scaleFactor = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);
  return Math.round(size * scaleFactor);
};
export const screenWidth = width;
export const screenHeight = height;
export const gWidth = (size: number) => scaleSize(size);
export const gHeight = (size: number) => verticalScaleSize(size);
export const gFontSize = (size: number) => responsiveFontSize(size);
export const gMargin = (size: number) => scaleSize(size);
export const gPadding = (size: number) => scaleSize(size);
export const gBorderRadius = (size: number) => scaleSize(size);
export const gGap = (size: number) => scaleSize(size);

// ─── EXPORTED STYLE TOKENS ──────────────────────────────────────────

// Font sizes
export const fontSizes = {
  small: gFontSize(12),
  body: gFontSize(14),
  subHeading: gFontSize(16),
  heading: gFontSize(18),
  largeTitle: gFontSize(20),
};

// Spacing (for margins, paddings, etc.)
export const margin = {
  small: gMargin(8),
  default: gMargin(16),
  large: gMargin(24),
};

export const padding = {
  small: gPadding(8),
  default: gPadding(16),
  large: gPadding(24),
};

// Button heights – using the same tokens so that a “small” button, for example,
// has the same size as a “small” font and spacing.
export const buttonHeights = {
  small: gHeight(32),
  default: gHeight(48),
  large: gHeight(64),
};

// Border radius can also be scaled similarly (here we adjust the numbers as needed)
export const borderRadius = {
  small: gBorderRadius(4),
  default: gBorderRadius(8),
  large: gBorderRadius(25),
  circle: gBorderRadius(50),
};
export const gaps = {
  small: gGap(5),
  default: gGap(10),
  medium: gGap(15),
  large: gGap(20),
  extraLarge: gGap(25),
};
