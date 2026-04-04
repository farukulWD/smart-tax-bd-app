// ─── Tax Year Picker ──────────────────────────────────────────────────────────

import { useState } from 'react';
import { Text } from '@/components/ui/text';
import { Pressable, ScrollView, View } from 'react-native';
import { TAX_YEARS } from '@/src/utils/commonFunction';

const TaxYearPicker = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <Pressable
        className="flex-row items-center justify-between rounded-xl border border-border bg-muted px-4 py-3"
        onPress={() => setOpen((p) => !p)}>
        <Text className="text-sm text-foreground">{value}</Text>
        <Text className="text-[11px] text-foreground">{open ? '▲' : '▼'}</Text>
      </Pressable>

      {open && (
        <View className="z-50 mt-1 overflow-hidden rounded-xl border border-border bg-muted shadow-md">
          <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
            {TAX_YEARS.map((year) => (
              <Pressable
                key={year}
                className={`px-4 py-3 ${year === value ? 'border-b border-b-border bg-card' : ''}`}
                onPress={() => {
                  onChange(year);
                  setOpen(false);
                }}>
                <Text
                  className={`text-sm ${
                    year === value ? 'font-semibold text-green-700' : 'text-mutedForeground'
                  }`}>
                  {year}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default TaxYearPicker;
