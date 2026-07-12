import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { useThemeColors } from '@/src/theme/useThemeColors';

export const BackButton = ({ onPress }: { onPress?: () => void }) => {
  const navigation = useNavigation();
  const { colors } = useThemeColors();

  return (
    <TouchableOpacity
      onPress={onPress ?? (() => navigation.goBack())}
      activeOpacity={0.7}
      className="h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
      <ArrowLeft size={24} color={colors.foreground} />
    </TouchableOpacity>
  );
};
