import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();

  const handleRegister = async () => {
    setLoading(true);
    try {
      await register(name, email, password);
      router.replace('/(app)/home');
    } catch (error) {
      alert('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
        <View className="mt-12 mb-8">
          <Text className="text-4xl font-bold text-primary mb-2 font-inter">
            Create Account
          </Text>
          <Text className="text-gray-600 font-inter">
            Join the Vhennus civilization
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-bold mb-2 font-inter">Full Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 font-inter"
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
          </View>

          <View>
            <Text className="text-sm font-bold mb-2 font-inter">Email</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 font-inter"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          <View>
            <Text className="text-sm font-bold mb-2 font-inter">Password</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 font-inter"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            className="bg-primary px-4 py-3 rounded-lg items-center mt-6 disabled:opacity-50"
            onPress={handleRegister}
            disabled={loading}
          >
            <Text className="text-white font-bold font-inter">
              {loading ? 'Creating account...' : 'Register'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600 font-inter">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text className="text-primary font-bold font-inter">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
