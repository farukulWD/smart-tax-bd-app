import { View, ScrollView } from 'react-native';

import HomeNewsSection from '@/src/components/home/HomeNewsSection';
import TaxTypeSection from '@/src/components/home/TaxTypeSection';
import HomeHeader from '@/src/components/home/HomeHeader';

const HomeScreen = () => {
  return (
    <View className="flex-1 bg-background">
      <HomeHeader />
      <HomeNewsSection />
      <View className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-3 py-3">
          <TaxTypeSection />
        </ScrollView>
      </View>
    </View>
  );
};

export default HomeScreen;
