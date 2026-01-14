import { Colors } from '@/src/context/ThemeProvider';
import { PressableScale } from './PressableScale';
import { ArrowLeft } from 'lucide-react-native';

export const BackButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <PressableScale
      onPress={onPress}
      className="h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
      <ArrowLeft size={24} color={Colors.foreground} />
    </PressableScale>
  );
};
