// components/PackageCard.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Star, ChevronDown, Check } from 'lucide-react-native';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Text } from '@/components/ui/text';

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
      className={`mb-5 overflow-hidden rounded-2xl ${
        isPlatinum
          ? 'border-2 border-amber-500 bg-gradient-to-b from-amber-50 to-white'
          : highlighted
            ? 'border-2 border-emerald-500 bg-white'
            : 'border border-gray-200 bg-white'
      }`}>
      {/* Popular Badge */}
      {isPlatinum && (
        <View className="absolute right-4 top-4 z-10 rounded-full bg-amber-500 px-3 py-1.5">
          <Text className="text-xs font-bold text-white">POPULAR</Text>
        </View>
      )}

      {/* Header */}
      <View className="">
        <Text className="text-2xl font-bold text-gray-900">{name}</Text>

        {/* Price */}
        <View className="">
          {isContactPrice ? (
            <Text className="text-lg font-semibold text-gray-700">Contact for pricing</Text>
          ) : price ? (
            <View className="flex-row items-baseline">
              <Text variant={'h2'}>
                {currency}
                {typeof price === 'number' ? price.toLocaleString() : price}
              </Text>
            </View>
          ) : null}
        </View>

        <Text className="text-sm text-gray-600">{description}</Text>
      </View>

      {/* CTA Button - Moved up */}
      <View className="">
        <TouchableOpacity
          onPress={onSelect}
          activeOpacity={0.7}
          className={`items-center justify-center rounded-xl${
            isPlatinum ? 'bg-amber-500' : highlighted ? 'bg-emerald-600' : 'bg-gray-900'
          }`}>
          <Text className="text-base font-semibold text-white">{buttonText}</Text>
        </TouchableOpacity>
      </View>

      {/* Collapsible Features */}
      <Collapsible>
        <CollapsibleTrigger onPress={() => setIsOpen(!isOpen)}>
          <View className="border-t border-gray-200 bg-gray-50">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-gray-700">
                {isOpen ? 'Hide' : 'Show'} features ({features.length})
              </Text>
              <ChevronDown
                size={20}
                color="#374151"
                strokeWidth={2}
                style={{
                  transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
                }}
              />
            </View>
          </View>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <View className="border-t border-gray-100 bg-white">
            {features.map((feature, index) => (
              <View key={index} className={`flex-row items-start ${index !== 0 ? 'mt-3' : ''}`}>
                <Check size={18} color="#10b981" strokeWidth={2.5} className="" />
                <Text className="flex-1 text-sm text-gray-700">{feature}</Text>
              </View>
            ))}
          </View>
        </CollapsibleContent>
      </Collapsible>
    </View>
  );
};
