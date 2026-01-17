import { View, Text, Pressable } from 'react-native';
import React, { useState } from 'react';
import { FAQItem } from '@/src/screen/faq/FAQScreen';

const FaqItem = ({ item }: { item: FAQItem }) => {
  const [openIndex, setOpenIndex] = useState(false);
  return (
    <View className="mb-3 rounded-xl border border-border bg-card px-3 py-4">
      <Pressable
        onPress={() => setOpenIndex(!openIndex)}
        className="flex-row items-start justify-between"
        hitSlop={6}>
        <Text className="flex-1 pr-3 font-semibold text-foreground">{item.question}</Text>
        <Text className="font-semibold text-mutedForeground">{openIndex ? '−' : '+'}</Text>
      </Pressable>

      {openIndex ? (
        <View className="mt-2">
          <Text className="leading-5 text-mutedForeground">{item.answer}</Text>

          {!!item.note && (
            <View className="mt-2 rounded-lg bg-muted px-3 py-2">
              <Text className="text-foreground">{item.note}</Text>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
};

export default FaqItem;
