import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AppStackParamList } from '@/src/navigation/AppStack';
import Header from '@/src/components/global/Header';
import HomeBanner from '@/src/components/global/HomeBanner';
import Marquee from '@/src/components/global/Marquee';
import { PackageCard } from '@/src/components/package/PackageCard';
import { navigate } from '@/src/utils/NavigationUtils';

const data = {
  packages: [
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
      button_text: 'Contact for price',
      highlight: true,
    },
    {
      name: 'Premium',
      price: 3450,
      currency: 'BDT',
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
      button_text: 'Select',
    },
    {
      name: 'Standard',
      price: 550,
      currency: 'BDT',
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
      button_text: 'Select',
    },
  ],
};

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  let p = {
    name: 'Standard',
    price: 550,
    currency: 'BDT',
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
    button_text: 'Select',
  };
  return (
    <View className="flex-1 bg-background">
      <Header />
      <View className="flex-1 px-4 pt-3">
        <ScrollView contentContainerClassName="gap-3">
          <Marquee>
            <Text
              className="font-bold uppercase tracking-wider text-foreground"
              style={{
                textAlign: 'center',
              }}
              numberOfLines={1}>
              Smart Tax BD
              {'       '}
            </Text>
          </Marquee>
          <HomeBanner />
          <PackageCard
            name={p.name}
            buttonText="Let's Continue"
            description={p.description}
            features={p.features}
            currency={'৳'}
            highlighted={true}
            isPlatinum={false}
            price={p.price}
          />
          <Button
            onPress={() => {
              navigate('Packages');
            }}
            variant={'outline'}>
            <Text>See All Packages</Text>
          </Button>
        </ScrollView>
      </View>
    </View>
  );
};

export default HomeScreen;
