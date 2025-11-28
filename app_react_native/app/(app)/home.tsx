import { ScrollView, View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar, ChartLine, Globe, Users, AppWindow } from 'lucide-react-native';

const logo = require('@/assets/vlogosm.png');
const innovImage = require('@/assets/innov2.png');
const jobsImage = require('@/assets/jobs.png');

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <View className="flex-row items-center space-x-2">
            <Image source={logo} className="w-8 h-4" resizeMode="contain" />
            <Text className="text-2xl font-bold text-primary font-inter">Vhennus</Text>
          </View>
        </View>

        {/* Hero Section */}
        <View className="h-96 bg-black relative">
          <Image
            source={require('@/assets/bg.png')}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/40" />
          <View className="absolute inset-0 justify-center px-4">
            <Text className="text-4xl font-extrabold text-white mb-4 font-inter">
              Vhennus Digital Nation
            </Text>
            <Text className="text-xl text-white font-light font-inter">
              Bringing like minded people to create a new civilization
            </Text>
          </View>
        </View>

        {/* Mission Section */}
        <View className="px-4 py-8">
          <Text className="text-lg font-inter text-gray-600 mb-4">Vhennus Mission</Text>
          <Text className="text-3xl font-bold text-primary mb-4 font-inter">
            To build a new civilization first digitally, and then physically. A place where our citizens are enabled to be creative, healthy and happy.
          </Text>
          <Text className="text-lg font-normal text-gray-700 font-inter">
            We will provide our citizens with jobs, business financing, research financing, healthcare and other critical infrastructure.
          </Text>
        </View>

        {/* Innovation Image */}
        <View className="px-4 py-4">
          <Image
            source={innovImage}
            className="w-full h-48 rounded-lg"
            resizeMode="cover"
          />
        </View>

        {/* Blockchain Features */}
        <View className="py-8">
          <Text className="text-3xl font-bold text-center mb-8 font-inter">
            The Vhennus Blockchain
          </Text>
          <View className="px-4 space-y-6">
            <FeatureCard icon={ChartLine} title="Tokenization" description="Our blockchain helps people and organizations tokenize their real world assets and trade these assets on our decentralized exchange." />
            <FeatureCard icon={Users} title="Citizenship" description="Any one from all over the world can become citizens of our ecosystem and enjoy the benefits of being a loyal member of our new civilization" />
            <FeatureCard icon={Globe} title="DAOs" description="We are giving teams and organizations to create decentralized autonomous organizations on the vhennus blockchain" />
            <FeatureCard icon={AppWindow} title="dApps" description="Developers can build visual applications that runs in our software ecosystem" />
            <FeatureCard icon={ChartBar} title="Capital Markets" description="Companies can sell tokenized shares on our exchange" />
          </View>
        </View>

        {/* Responsibility Section */}
        <View className="px-4 py-8">
          <Text className="text-3xl font-bold mb-6 font-inter">Our Responsibility To Our Citizens</Text>
          <Image
            source={jobsImage}
            className="w-full h-48 rounded-lg mb-4"
            resizeMode="cover"
          />
          <Text className="text-2xl font-bold mb-3 font-inter">Job Creation</Text>
          <Text className="text-base font-normal text-gray-700 font-inter">
            We will provide jobs to our citizens through our various projects and initiatives. We will also provide training and education to help our citizens develop the skills they need to succeed in the new economy.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <View className="bg-gray-50 p-4 rounded-lg mb-4">
      <Icon size={28} color="#000000" className="mb-3" />
      <Text className="text-xl font-bold mb-2 font-inter">{title}</Text>
      <Text className="text-sm text-gray-700 font-inter">{description}</Text>
    </View>
  );
}
