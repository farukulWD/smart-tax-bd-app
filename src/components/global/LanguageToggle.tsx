import { View, Text, TouchableOpacity } from 'react-native';
import { useLocale } from '@/src/localization/useLocale';
import { cn } from '@/src/utils/cn';

const LanguageToggle = () => {
  const { setLocale, isBangla, isEnglish } = useLocale();

  const toggleLanguage = () => {
    setLocale(isBangla ? 'en' : 'bn');
  };

  return (
    <TouchableOpacity
      onPress={toggleLanguage}
      className="flex-row items-center rounded-full border border-border bg-secondary px-3 py-1">
      <Text
        className={cn(
          'text-xs font-medium',
          isEnglish ? 'text-primary-foreground rounded-full bg-primary px-1' : 'text-foreground'
        )}>
        EN
      </Text>
      <View className="mx-2 h-3 w-[1px] bg-border" />
      <Text
        className={cn(
          'text-xs font-medium',
          isBangla ? 'text-primary-foreground rounded-full bg-primary px-1' : 'text-foreground'
        )}>
        BN
      </Text>
    </TouchableOpacity>
  );
};

export default LanguageToggle;
