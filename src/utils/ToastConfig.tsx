import { StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react-native';
import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
import { Colors } from '@/src/context/ThemeProvider';

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

export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={styles.successContainer}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.title}
      text2Style={styles.description}
      text2NumberOfLines={3}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={styles.errorContainer}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.title}
      text2Style={styles.description}
      text2NumberOfLines={3}
    />
  ),

  customSuccess: ({ text1 }) => (
    <CustomToastLayout
      text1={text1}
      icon={<CheckCircle size={30} color="#15803D" />}
      bgStyle={styles.customSuccessBg}
      textStyle={styles.customSuccessText}
    />
  ),
  customError: ({ text1 }) => (
    <CustomToastLayout
      text1={text1}
      icon={<XCircle size={30} color="#B91C1C" />}
      bgStyle={styles.customErrorBg}
      textStyle={styles.customErrorText}
    />
  ),
  customWarning: ({ text1 }) => (
    <CustomToastLayout
      text1={text1}
      icon={<AlertTriangle size={30} color="#C2410C" />}
      bgStyle={styles.customWarningBg}
      textStyle={styles.customWarningText}
    />
  ),
};

const styles = StyleSheet.create({
  // --- Classic Design Styles ---
  successContainer: {
    borderLeftColor: '#6366F1',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    minHeight: 68,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  errorContainer: {
    borderLeftColor: '#EF4444',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    minHeight: 68,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contentContainer: {
    paddingHorizontal: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  description: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },

  // --- New Capsule Design Styles ---
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
  customSuccessBg: { backgroundColor: '#DCFCE7', borderColor: '#9bfebe' },
  customSuccessText: { color: '#15803D' },
  customErrorBg: { backgroundColor: '#FEE2E2', borderColor: '#ff9191' },
  customErrorText: { color: '#B91C1C' },
  customWarningBg: { backgroundColor: '#FFEDD5', borderColor: '#ffc078' },
  customWarningText: { color: '#C2410C' },
});

// export const showToast = ({ message, position }) => {
//   Toast.show({
//     type: 'success',
//     text1: message || 'No message found',
//     visibilityTime: 1000,
//     position: position || 'bottom',
//   });
// };

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
