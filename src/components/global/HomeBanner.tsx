import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ViewStyle,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

import { screenWidth } from '../../utils/Sizes';
import { TSlide } from '@/src/types/productTypes';
import { Colors } from '@/src/context/ThemeProvider';

const HORIZONTAL_PADDING = 12;
const PAGE_WIDTH = screenWidth;
const SLIDE_WIDTH = PAGE_WIDTH - HORIZONTAL_PADDING * 2;
const AUTO_SLIDE_INTERVAL = 3000;

interface HomeBannerProps {
  containerStyle?: ViewStyle;
}

const HomeBanner: React.FC<HomeBannerProps> = ({ containerStyle }) => {
  const slides = useMemo(() => (s ? s.filter((item) => item.isActive) : []), [s]);

  const flatListRef = useRef<FlatList<TSlide>>(null);
  const timerRef = useRef<number | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    timerRef.current && clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;

        // ⬅️ loop back to start
        if (next >= slides.length) {
          flatListRef.current?.scrollToIndex({
            index: 0,
            animated: false, // instant jump
          });
          return 0;
        }

        flatListRef.current?.scrollToIndex({
          index: next,
          animated: true,
        });

        return next;
      });
    }, AUTO_SLIDE_INTERVAL);

    return () => {
      timerRef.current && clearInterval(timerRef.current);
    };
  }, [slides.length]);

  /** Sync index on manual scroll */
  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / PAGE_WIDTH);
    setCurrentIndex(index);
  };

  const getItemLayout = (_: any, index: number) => ({
    length: PAGE_WIDTH,
    offset: PAGE_WIDTH * index,
    index,
  });

  const renderItem = ({ item }: { item: TSlide }) => {
    const source = typeof item === 'number' ? item : { uri: item.image };

    return (
      <View style={styles.page}>
        <Image source={source} style={styles.image} resizeMode="cover" />
      </View>
    );
  };

  if (!slides.length) {
    return;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.imageContainer}>
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          getItemLayout={getItemLayout}
          onMomentumScrollEnd={handleMomentumScrollEnd}
        />

        {slides.length > 1 && (
          <View style={styles.dotsContainer}>
            {slides.map((_, i) => (
              <View key={i} style={[styles.dot, i === currentIndex && styles.activeDot]} />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  imageContainer: {
    width: PAGE_WIDTH,
    overflow: 'hidden',
  },

  page: {
    width: PAGE_WIDTH,
    paddingHorizontal: HORIZONTAL_PADDING,
    aspectRatio: 46 / 13,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: SLIDE_WIDTH,
    height: '100%',
    borderRadius: 20,
    backgroundColor: Colors.background,
  },

  dotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 3,
  },

  activeDot: {
    backgroundColor: '#fff',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default HomeBanner;

const s: TSlide[] = [
  {
    id: 'slide-001',
    title: 'Abstract Technology Banner',
    image:
      'https://img.freepik.com/free-vector/abstract-fluid-effect-sales-background_23-2148239791.jpg?uid=R154679726&ga=GA1.1.1312291187.1763529352&semt=ais_hybrid&w=740&q=80',
    isActive: true,
    order: 1,
    linkType: 'external',
    linkUrl:
      'https://www.freepik.com/free-vector/abstract-technology-banner-background_4120175.htm',
    description: 'Modern abstract tech-style banner background for hero sliders.',
  },
  {
    id: 'slide-002',
    title: 'Business Banner Background Collection',
    image:
      'https://img.freepik.com/free-vector/big-sale-promotional-banner-neon-green-style-with-triangle-shape_1017-55185.jpg?uid=R154679726&ga=GA1.1.1312291187.1763529352&semt=ais_hybrid&w=740&q=80',
    isActive: true,
    order: 2,
    linkType: 'external',
    linkUrl: 'https://www.freepik.com/free-photos-vectors/business-banner-background',
    description: 'Business-friendly banner backgrounds (photos/vectors) for corporate sliders.',
  },
  {
    id: 'slide-003',
    title: 'Food Delivery Banner Collection',
    image:
      'https://img.freepik.com/free-vector/eco-friendly-card_1035-411.jpg?t=st=1768040456~exp=1768044056~hmac=890935bda204e9bfa1703627fc8eabf1e647c09cd21b19924a9db2b6d07e7514&w=2000',
    isActive: true,
    order: 3,
    linkType: 'external',
    linkUrl: 'https://www.freepik.com/free-photos-vectors/food-delivery-banner',
    description: 'Food delivery and restaurant banner assets perfect for promo sliders.',
  },
  {
    id: 'slide-004',
    title: 'Summer Travel Banner Collection',
    image:
      'https://img.freepik.com/free-photo/black-friday-sales-illustration_23-2152020713.jpg?t=st=1768040546~exp=1768044146~hmac=0e567897deee215d6bcdfbf3370cbf895abe08ca357506b1f3bb8c25e41bc8e0&w=2000',
    isActive: false,
    order: 4,
    linkType: 'external',
    linkUrl: 'https://www.freepik.com/free-photos-vectors/summer-travel-banner',
    description: 'Travel/summer themed banner visuals for seasonal campaigns.',
  },
  {
    id: 'slide-005',
    title: 'Modern Banner Background Collection',
    image:
      'https://img.freepik.com/free-photo/black-friday-sales-illustration_23-2152020713.jpg?t=st=1768040546~exp=1768044146~hmac=0e567897deee215d6bcdfbf3370cbf895abe08ca357506b1f3bb8c25e41bc8e0&w=2000',
    isActive: true,
    order: 5,
    linkType: 'external',
    linkUrl: 'https://www.freepik.com/free-photos-vectors/modern-banner-background',
    description: 'Clean modern banner background assets suitable for homepage sliders.',
  },
];
