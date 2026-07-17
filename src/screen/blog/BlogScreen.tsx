import { View } from 'react-native';
import NoData from '@/src/components/global/NoData';

const BlogScreen = () => (
  <View className="flex-1 items-center justify-center bg-background">
    <NoData message="No blogs yet." />
  </View>
);

export default BlogScreen;
