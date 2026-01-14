// components/PackageCard.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { Colors } from '@/src/context/ThemeProvider';

type PackageFeature = string;

interface PackageCardProps {
  name: string;
  price?: number | string;
  currency?: string;
  description: string;
  features: PackageFeature[];
  buttonText: string;
  isPlatinum?: boolean;
  onSelect?: () => void;
  highlighted?: boolean;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  name,
  price,
  currency = '৳',
  description,
  features,
  buttonText,
  isPlatinum = false,
  onSelect,
  highlighted = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isContactPrice = typeof price === 'string' && price.includes('Contact');

  // Map “special” states to your palette tokens (no raw grays/emerald/amber)
  const badgeBg = isPlatinum ? 'bg-primary' : highlighted ? 'bg-primary' : 'bg-muted';
  const badgeText = isPlatinum || highlighted ? 'text-primaryForeground' : 'text-foreground';

  const ctaBg = isPlatinum || highlighted ? 'bg-primary' : 'bg-foreground';
  const ctaText = isPlatinum || highlighted ? 'text-primaryForeground' : 'text-background';

  return (
    <View
      className={cn(
        `overflow-hidden rounded-2xl`,
        isPlatinum || highlighted
          ? 'border-2 border-primary bg-accent'
          : 'border border-border bg-accent'
      )}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-3">
        <View className="flex-1 flex-row items-center gap-3">
          <Text className="text-xl font-bold text-foreground" numberOfLines={1}>
            {name}
          </Text>

          {(isPlatinum || highlighted) && (
            <View className={`rounded-full px-3 py-1 ${badgeBg}`}>
              <Text className={`text-xs font-bold ${badgeText}`}>
                {isPlatinum ? 'POPULAR' : 'RECOMMENDED'}
              </Text>
            </View>
          )}
        </View>

        {/* Price */}
        <View>
          {isContactPrice ? (
            <View className="h-12 items-end justify-center">
              <Text className="text-mutedForeground text-base font-semibold">
                Contact for pricing
              </Text>
            </View>
          ) : price ? (
            <View className="flex-row items-end">
              <Text className="text-3xl font-bold text-foreground">
                {currency}
                {typeof price === 'number' ? price.toLocaleString() : price}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <Text className="text-mutedForeground px-4 pt-1 text-sm">{description}</Text>

      {/* CTA */}
      <View>
        <TouchableOpacity
          onPress={onSelect}
          activeOpacity={0.8}
          className={`m-4 h-12 items-center justify-center rounded-xl ${ctaBg}`}>
          <Text className={`text-base font-semibold ${ctaText}`}>{buttonText}</Text>
        </TouchableOpacity>
      </View>

      {/* Collapsible Features */}
      <Collapsible>
        <CollapsibleTrigger onPress={() => setIsOpen(!isOpen)}>
          <View className="h-12 justify-center border-t border-border bg-secondary px-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-foreground">
                {isOpen ? 'Hide' : 'Show'} features ({features.length})
              </Text>
              <ChevronDown
                size={20}
                color={Colors.foreground}
                strokeWidth={2}
                style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
              />
            </View>
          </View>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <View className="border-t border-border bg-card p-4">
            {features.map((feature, index) => (
              <View
                key={index}
                className={`flex-row items-start gap-2 ${index !== 0 ? 'mt-3' : ''}`}>
                <Check size={18} color={Colors.primary} strokeWidth={2.5} />
                <Text className="text-mutedForeground flex-1 text-sm">{feature}</Text>
              </View>
            ))}
          </View>
        </CollapsibleContent>
      </Collapsible>
    </View>
  );
};
