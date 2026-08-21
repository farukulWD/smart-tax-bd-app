import { Platform, Text, TextProps } from 'react-native';

export type AppTextProps = TextProps;

/**
 * Android truncates the last cluster of complex scripts (Bangla in our case —
 * "লগ ইন" renders as "লগ") because the high-quality break strategy mismeasures
 * the line. `textBreakStrategy="simple"` fixes the measurement, and the
 * trailing space keeps a spare cluster at the end so nothing visible can be
 * clipped on devices/fonts where the bug still shows up.
 */
const AppText = ({ children, ...props }: AppTextProps) => (
  <Text textBreakStrategy="simple" android_hyphenationFrequency="none" {...props}>
    {children}
    {Platform.OS === 'android' ? ' ' : null}
  </Text>
);

export default AppText;
