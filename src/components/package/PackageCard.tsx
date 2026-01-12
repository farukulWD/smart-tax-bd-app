// components/PackageCard.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Star, ChevronDown, Check } from 'lucide-react-native';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Text } from '@/components/ui/text';
import { Colors } from '@/lib/theme';

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

  return (
    <View
      className={`overflow-hidden rounded-2xl ${
        isPlatinum
          ? 'border-2 border-amber-500 bg-gradient-to-b from-amber-50 to-white'
          : highlighted
            ? 'border-2 border-emerald-500 bg-white'
            : 'border border-gray-200 bg-white'
      }`}>
      {/* Popular Badge */}

      {/* Header */}
      <View className="flex-row items-center justify-between px-3 pt-1">
        <View className="flex-row items-center gap-3">
          <Text className="text-xl font-bold text-gray-900">{name}</Text>
          {isPlatinum && (
            <View className="z-10 rounded-full bg-amber-500 px-3 py-1">
              <Text className="text-xs font-bold text-white">POPULAR</Text>
            </View>
          )}
        </View>

        {/* Price */}
        <View className="">
          {isContactPrice ? (
            <View className="h-12 items-center justify-center">
              <Text className="text-lg font-semibold text-gray-700">Contact for pricing</Text>
            </View>
          ) : price ? (
            <View className="mt-2 flex-row">
              <Text className="text-3xl font-bold">
                {currency}
                {typeof price === 'number' ? price.toLocaleString() : price}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      <Text className="px-4 text-sm text-muted-foreground">{description}</Text>

      {/* CTA Button - Moved up */}
      <View className="">
        <TouchableOpacity
          onPress={onSelect}
          activeOpacity={0.7}
          className={`m-3 h-12 items-center justify-center rounded-xl bg-primary ${
            isPlatinum ? 'bg-amber-500' : highlighted ? 'bg-emerald-600' : 'bg-gray-900'
          }`}>
          <Text className="text-base font-semibold text-white">{buttonText}</Text>
        </TouchableOpacity>
      </View>

      {/* Collapsible Features */}
      <Collapsible>
        <CollapsibleTrigger onPress={() => setIsOpen(!isOpen)}>
          <View className="h-12 justify-center border-t border-gray-200 bg-gray-50 px-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-foreground">
                {isOpen ? 'Hide' : 'Show'} features ({features.length})
              </Text>
              <ChevronDown
                size={20}
                color={Colors.foreground}
                strokeWidth={2}
                style={{
                  transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
                }}
              />
            </View>
          </View>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <View className="border-t border-gray-100 bg-white p-3">
            {features.map((feature, index) => (
              <View
                key={index}
                className={`flex-row items-start gap-2 ${index !== 0 ? 'mt-3' : ''}`}>
                <Check size={18} color="#10b981" strokeWidth={2.5} className="" />
                <Text className="flex-1 text-sm text-muted-foreground">{feature}</Text>
              </View>
            ))}
          </View>
        </CollapsibleContent>
      </Collapsible>
    </View>
  );
};
