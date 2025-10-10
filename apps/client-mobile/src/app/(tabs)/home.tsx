import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4">
        <View className="py-6">
          <Text className="text-3xl font-bold text-foreground">
            Welcome to Senior Care Connect
          </Text>
          <Text className="mt-2 text-muted-foreground">
            Find the perfect care for your loved ones
          </Text>
        </View>

        <View className="mb-6">
          <View className="flex-row items-center rounded-lg border border-border bg-muted px-4 py-3">
            <Search size={20} className="text-muted-foreground" />
            <Text className="ml-3 text-muted-foreground">Search for services...</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="mb-3 text-xl font-semibold text-foreground">
            Featured Services
          </Text>
          <View className="space-y-4">
            {[1, 2, 3].map((item) => (
              <View key={item} className="rounded-lg border border-border bg-card p-4">
                <View className="h-32 w-full rounded-lg bg-muted mb-3" />
                <Text className="text-lg font-semibold text-foreground">
                  Premium Senior Care {item}
                </Text>
                <Text className="mt-1 text-muted-foreground">
                  Professional 24/7 care services
                </Text>
                <Text className="mt-2 text-primary font-semibold">
                  ฿15,000/month
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}