import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MenuScreen() {
  const menuItems = [
    { title: 'Settings', onPress: () => {} },
    { title: 'Help & Support', onPress: () => {} },
    { title: 'About', onPress: () => {} },
    { title: 'Terms & Privacy', onPress: () => {} },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold font-inter">Menu</Text>
      </View>
      <ScrollView className="flex-1">
        <View className="px-4 py-4 space-y-2">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="py-4 border-b border-gray-200"
              onPress={item.onPress}
            >
              <Text className="text-lg font-inter">{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
