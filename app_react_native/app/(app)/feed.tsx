import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FeedScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold font-inter">Feed</Text>
      </View>
      <ScrollView className="flex-1">
        {/* Feed items will go here - fetch from your API */}
        <View className="px-4 py-4">
          <Text className="text-gray-500 font-inter">Feed content coming soon</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
