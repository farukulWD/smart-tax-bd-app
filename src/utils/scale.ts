import { Dimensions } from 'react-native';
import { FONT_SIZES, SPACING, varName } from '../../design-tokens';

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const { width, height } = Dimensions.get('screen');

const raw = Math.min(1, width / BASE_WIDTH, height / BASE_HEIGHT);

export const fontFactor = Math.max(0.85, 1 + (raw - 1) * 0.5);
export const spaceFactor = Math.max(0.82, 1 + (raw - 1) * 0.85);

export const scaleFont = (size: number) => Math.round(size * fontFactor);

export const scaleSpace = (size: number) => Math.max(1, Math.round(size * spaceFactor));

export const screenWidth = width;
export const screenHeight = height;

const toVars = (prefix: string, table: Record<string, number>, scale: (n: number) => number) =>
  Object.fromEntries(
    Object.entries(table).map(([key, size]) => [varName(prefix, key), scale(size)])
  );

export const scaleVars = {
  ...toVars('fs', FONT_SIZES, scaleFont),
  ...toVars('sp', SPACING, scaleSpace),
};
