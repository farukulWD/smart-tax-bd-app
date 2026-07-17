import { View, Text, TouchableOpacity } from 'react-native';
import { FilterStatus } from './types';

const FILTERS: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'documents_uploaded', label: 'Uploaded' },
  { key: 'order_placed', label: 'Placed' },
];

export const FilterTabs = ({
  active,
  onChange,
  counts,
}: {
  active: FilterStatus;
  onChange: (f: FilterStatus) => void;
  counts: Record<FilterStatus, number>;
}) => (
  <View className="mb-4 flex-row gap-2 px-4">
    {FILTERS.map((f) => {
      const isActive = active === f.key;
      return (
        <TouchableOpacity
          key={f.key}
          onPress={() => onChange(f.key)}
          activeOpacity={0.75}
          className={[
            'flex-row items-center gap-1.5 rounded-full px-3 py-2',
            isActive ? 'bg-primary' : 'bg-muted',
          ].join(' ')}>
          <Text
            className={`text-xs font-semibold ${
              isActive ? 'text-primaryForeground' : 'text-mutedForeground'
            }`}>
            {f.label}
          </Text>
          <View
            className={`h-4 w-4 items-center justify-center rounded-full ${
              isActive ? 'bg-primaryForeground/20' : 'bg-background'
            }`}>
            <Text
              className={`text-[10px] font-bold ${
                isActive ? 'text-primaryForeground' : 'text-mutedForeground'
              }`}>
              {counts[f.key]}
            </Text>
          </View>
        </TouchableOpacity>
      );
    })}
  </View>
);
