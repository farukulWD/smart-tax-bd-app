import { View, TouchableOpacity } from 'react-native';
import AppText from '@/src/components/common/AppText';
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
      <AppText
        className={cn(
          'text-xs font-medium',
          isEnglish ? 'rounded-full bg-primary px-1 text-primaryForeground' : 'text-foreground'
        )}>
        EN
      </AppText>
      <View className="mx-2 h-3 w-[1px] bg-border" />
      <AppText
        className={cn(
          'text-xs font-medium',
          isBangla ? 'rounded-full bg-primary px-1 text-primaryForeground' : 'text-foreground'
        )}>
        BN
      </AppText>
    </TouchableOpacity>
  );
};

export default LanguageToggle;
