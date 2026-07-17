import { StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react-native';
import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
import type { lightColors } from '@/src/theme/colors';

type ThemeColors = typeof lightColors;

interface CustomToastLayoutProps {
  text1?: string;
  icon: React.ReactNode;
  bgStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const CustomToastLayout = ({ text1, icon, bgStyle, textStyle }: CustomToastLayoutProps) => (
  <View style={[styles.customBaseContainer, bgStyle]}>
    <View style={styles.iconWrapper}>{icon}</View>
    <Text style={[styles.customTitle, textStyle]} numberOfLines={2}>
      {text1}
    </Text>
  </View>
);

export const createToastConfig = (colors: ThemeColors): ToastConfig => {
  // The capsule sits on the theme's card surface with a status-tinted border and
  // label, so it stays legible in both themes. A fixed pastel fill could not.
  const capsule = (accent: string): { bg: ViewStyle; text: TextStyle } => ({
    bg: { backgroundColor: colors.card, borderColor: accent },
    text: { color: accent },
  });

  const success = capsule(colors.success);
  const error = capsule(colors.destructive);
  const warning = capsule(colors.warning);

  return {
    success: (props) => (
      <BaseToast
        {...props}
        style={[
          styles.baseContainer,
          { borderColor: colors.border, backgroundColor: colors.card, borderLeftColor: colors.success },
        ]}
        contentContainerStyle={styles.contentContainer}
        text1Style={[styles.title, { color: colors.foreground }]}
        text2Style={[styles.description, { color: colors.mutedForeground }]}
        text2NumberOfLines={3}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={[
          styles.baseContainer,
          {
            borderColor: colors.border,
            backgroundColor: colors.card,
            borderLeftColor: colors.destructive,
          },
        ]}
        contentContainerStyle={styles.contentContainer}
        text1Style={[styles.title, { color: colors.foreground }]}
        text2Style={[styles.description, { color: colors.mutedForeground }]}
        text2NumberOfLines={3}
      />
    ),

    customSuccess: ({ text1 }) => (
      <CustomToastLayout
        text1={text1}
        icon={<CheckCircle size={30} color={colors.success} />}
        bgStyle={success.bg}
        textStyle={success.text}
      />
    ),
    customError: ({ text1 }) => (
      <CustomToastLayout
        text1={text1}
        icon={<XCircle size={30} color={colors.destructive} />}
        bgStyle={error.bg}
        textStyle={error.text}
      />
    ),
    customWarning: ({ text1 }) => (
      <CustomToastLayout
        text1={text1}
        icon={<AlertTriangle size={30} color={colors.warning} />}
        bgStyle={warning.bg}
        textStyle={warning.text}
      />
    ),
  };
};

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: 16,
    minHeight: 68,
    borderWidth: 1,
  },
  contentContainer: {
    paddingHorizontal: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    fontWeight: '500',
  },

  // --- Capsule design ---
  customBaseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginTop: -20,
  },
  iconWrapper: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customTitle: {
    fontSize: 15,
    flex: 1,
  },
});

export const toast: Record<'success' | 'error' | 'warning', (message: string) => void> = {
  success: (message: string) => {
    Toast.show({
      type: 'customSuccess',
      text1: message,
      position: 'top',
      topOffset: 60,
    });
  },
  error: (message: string) => {
    Toast.show({
      type: 'customError',
      text1: message,
      position: 'top',
      topOffset: 60,
    });
  },
  warning: (message: string) => {
    Toast.show({
      type: 'customWarning',
      text1: message,
      position: 'top',
      topOffset: 60,
    });
  },
};
