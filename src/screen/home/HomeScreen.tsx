import { View, ScrollView } from 'react-native';
import React from 'react';
import { Button } from '@/components/ui/button';

import Header from '@/src/components/global/Header';
import HomeBanner from '@/src/components/global/HomeBanner';
import { PackageCard } from '@/src/components/package/PackageCard';
import { navigate } from '@/src/utils/NavigationUtils';
import { Text } from '@/components/ui/text';
import HomeNewsSection from '@/src/components/home/HomeNewsSection';
import TaxTypeSection from '@/src/components/home/TaxTypeSection';
import ToggleTheme from '@/src/components/common/ToggleTheme';

const HomeScreen = () => {
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
      <View className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-3 py-3">
          <HomeNewsSection />
          <HomeBanner />
          <ToggleTheme />
          <TaxTypeSection />
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
            <Text className="" variant={'default'}>
              See All Packages
            </Text>
          </Button>
        </ScrollView>
      </View>
    </View>
  );
};

export default HomeScreen;
