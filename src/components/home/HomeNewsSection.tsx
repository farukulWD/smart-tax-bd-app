import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Marquee from '../global/Marquee';
import { useGetAllNewsQuery } from '@/src/services/publicApi';
import { navigate } from '@/src/utils/NavigationUtils';

const SEPARATOR = '          ◆          ';

const HomeNewsSection = () => {
  const { data, isLoading } = useGetAllNewsQuery();

  const marqueeContent = data?.data?.map((item) => item.title).join(SEPARATOR);
  const handleNavigateToNewDetails = (id: string) => {
    navigate('NewsDetails', { newsId: id });
  };

  return (
    <View className="flex-row items-center bg-muted">
      <View className="bg-destructive px-2 py-1">
        <Text className="text-white">News</Text>
      </View>

      <Marquee speed={40} style={{}}>
        {isLoading || !marqueeContent ? (
          <Text className="text-foreground">Loading news...</Text>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {data?.data?.map((item, index) => (
              <Pressable
                onPress={() => {
                  item?._id && handleNavigateToNewDetails(item._id);
                }}
                key={item._id ?? index}>
                <Text className="font-medium capitalize text-foreground">
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
