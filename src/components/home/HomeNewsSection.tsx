import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Marquee from '../global/Marquee';
import { useGetAllNewsQuery } from '@/src/services/publicApi';

const SEPARATOR = '          ◆          '; // visual separator between items

const HomeNewsSection = () => {
  const { data, isLoading } = useGetAllNewsQuery();

  const marqueeContent = data?.data?.map((item) => item.title).join(SEPARATOR);

  return (
    <View className="flex-row items-center bg-muted">
      <View className="bg-destructive px-2 py-1">
        <Text className="text-white">News</Text>
      </View>

      <Marquee speed={80} style={{}}>
        {isLoading || !marqueeContent ? (
          <Text className="text-foreground">Loading news...</Text>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {data?.data?.map((item, index) => (
              <Pressable key={item._id ?? index}>
                <Text className="text-foreground">
                  {item.title}
                  {index < data.data.length - 1 ? SEPARATOR : ''}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </Marquee>
    </View>
  );
};

export default HomeNewsSection;
