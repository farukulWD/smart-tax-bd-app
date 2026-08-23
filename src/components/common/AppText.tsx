import { Platform, Text, TextProps } from 'react-native';

export type AppTextProps = TextProps;

/**
 * Android truncates the last cluster of complex scripts (Bangla in our case —
 * "লগ ইন" renders as "লগ") because the high-quality break strategy mismeasures
 * the line. `textBreakStrategy="simple"` fixes the measurement, and the
 * trailing space keeps a spare cluster at the end so nothing visible can be
 * clipped on devices/fonts where the bug still shows up.
 *
 * `maxFontSizeMultiplier` caps how far the OS "large text" setting can push our
 * type — the app already scales with device width (see `utils/fontScale`), and
 * an uncapped multiplier on top of that overflows dense screens. It sits before
 * the spread so a caller can still override it.
 */
const AppText = ({ children, ...props }: AppTextProps) => (
  <Text
    textBreakStrategy="simple"
    android_hyphenationFrequency="none"
    maxFontSizeMultiplier={1.2}
    {...props}>
    {children}
    {Platform.OS === 'android' ? ' ' : null}
  </Text>
);

export default AppText;
