import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold font-inter">Profile</Text>
      </View>
      <ScrollView className="flex-1">
        <View className="px-4 py-6">
          <Text className="text-lg font-bold mb-2 font-inter">{user?.name || 'User'}</Text>
          <Text className="text-gray-600 mb-6 font-inter">{user?.email}</Text>
          
          <TouchableOpacity
            className="bg-red-500 px-4 py-3 rounded-lg items-center"
            onPress={handleLogout}
          >
            <Text className="text-white font-bold font-inter">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
