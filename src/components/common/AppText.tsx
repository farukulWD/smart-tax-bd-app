import { Platform, Text, TextProps } from 'react-native';

export type AppTextProps = TextProps;

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
