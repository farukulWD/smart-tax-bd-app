import { View, Pressable } from 'react-native';
import AppText from '@/src/components/common/AppText';
import { useState } from 'react';
import { FaqItemType } from '@/src/types/publicTypes';

const FaqItem = ({ item }: { item: FaqItemType }) => {
  const [openIndex, setOpenIndex] = useState(false);
  return (
    <View className="mb-3 rounded-xl border border-border bg-card px-3 py-4">
      <Pressable
        onPress={() => setOpenIndex(!openIndex)}
        className="flex-row items-start justify-between"
        hitSlop={6}>
        <AppText className="flex-1 pr-3 font-semibold text-foreground">{item.question}</AppText>
        <AppText className="font-semibold text-mutedForeground">{openIndex ? '−' : '+'}</AppText>
      </Pressable>

      {openIndex ? (
        <View className="mt-2">
          <AppText className="leading-5 text-mutedForeground">{item.answer}</AppText>
        </View>
      ) : null}
    </View>
  );
};

export default FaqItem;
