// screens/PackagesScreen.tsx
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PackageCard } from '../../components/package/PackageCard';
import TitleHeader from '@/src/components/global/TitleHeader';

const packages = [
  {
    name: 'Platinum',
    price: 'Contact for price',
    description:
      'Your platinum journey starts here; elevate your tax filing experience with BDTTax.',
    features: [
      'Available in all over Bangladesh',
      'E-return tax preparation & Submit',
      'Dedicated Senior Tax Consultant',
      'Life-Time Audit Support',
      'Tax Certificate & acknowledgement slip',
      'Online Verification',
      'Store your return related documents securely',
      'Receive bank-level data encryption and protection',
      'VAT Included',
    ],
    buttonText: 'Contact for price',
    isPlatinum: true,
    highlighted: true,
  },
  {
    name: 'Premium',
    price: 3450,
    description:
      'Our experienced tax consultant will prepare your tax return and it will be submitted by BDTTax team',
    features: [
      'Available in all over Bangladesh',
      'E-return tax preparation & Submit',
      'Our experienced tax consultant will prepare your tax return',
      'Get 24/7 support from our online BDTTax specialists',
      'Store your return related documents securely',
      'Receive bank-level data encryption and protection',
      'VAT Included',
    ],
    buttonText: 'Select',
  },
  {
    name: 'Standard',
    price: 550,
    description: 'Prepare tax return, download & submit return by yourself',
    features: [
      'Available in all over Bangladesh',
      'Complete your return by quick & easy step-by-step process',
      'Receive 100% accurate & automatic tax calculation',
      'Get unlimited data revisions & unlimited PDF (tax return file) downloads',
      'Get easy download & print',
      'Submit tax return at your local NBR office',
      'Get 24/7 support from our online BDTTax specialists',
      'Store your return related documents securely',
      'Bank-level data encryption and protection',
      'VAT Included',
    ],
    buttonText: 'Select',
  },
];

export default function PackagesScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <TitleHeader title="Packages" />
      <ScrollView className="flex-1 px-4 pt-6">
        <Text className="mb-6 px-2 text-3xl font-bold text-gray-800">Choose Your Package</Text>

        {packages.map((pkg, index) => (
          <PackageCard key={index} {...pkg} onSelect={() => console.log(`${pkg.name} selected`)} />
        ))}
      </ScrollView>
    </View>
  );
}
