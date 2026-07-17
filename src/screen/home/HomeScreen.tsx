import { useState } from 'react';
import { View, ScrollView } from 'react-native';

import HomeNewsSection from '@/src/components/home/HomeNewsSection';
import TaxTypeSection from '@/src/components/home/TaxTypeSection';
import HomeHeader from '@/src/components/home/HomeHeader';
import HomeQuickActions from '@/src/components/home/HomeQuickActions';

const HomeScreen = () => {
  const [search, setSearch] = useState('');

  return (
    <View className="flex-1 bg-background">
      <HomeHeader searchQuery={search} onSearchChange={setSearch} />
      {/* <Header /> */}
      <HomeNewsSection />
      <View className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-3 py-3">
          {/* <HomeBanner /> */}
          <HomeQuickActions />
          <TaxTypeSection searchQuery={search} />
          {/* <PackageCard
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
          </Button> */}
        </ScrollView>
      </View>
    </View>
  );
};

export default HomeScreen;
