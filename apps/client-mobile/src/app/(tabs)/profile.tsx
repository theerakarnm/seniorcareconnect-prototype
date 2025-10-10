import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, HelpCircle, LogOut, Shield, Bell } from 'lucide-react-native';

export default function ProfileScreen() {
  const menuItems = [
    {
      icon: User,
      title: 'Personal Information',
      subtitle: 'Update your personal details',
    },
    {
      icon: Shield,
      title: 'Privacy Settings',
      subtitle: 'Manage your data and consent',
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Configure notification preferences',
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
    },
    {
      icon: Settings,
      title: 'Settings',
      subtitle: 'App settings and preferences',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Profile Header */}
        <View className="px-4 py-6 bg-muted border-b border-border">
          <View className="items-center">
            <View className="w-24 h-24 rounded-full bg-primary items-center justify-center mb-4">
              <User size={40} className="text-primary-foreground" />
            </View>
            <Text className="text-xl font-semibold text-foreground">
              John Doe
            </Text>
            <Text className="text-muted-foreground">
              john.doe@example.com
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-4 py-4">
          <View className="space-y-2">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center p-4 rounded-lg bg-card border border-border"
              >
                <View className="w-10 h-10 rounded-full bg-muted items-center justify-center mr-3">
                  <item.icon size={20} className="text-muted-foreground" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-foreground">
                    {item.title}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {item.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity className="flex-row items-center justify-center p-4 mt-6 rounded-lg border border-destructive bg-destructive/10">
            <LogOut size={20} className="text-destructive mr-2" />
            <Text className="text-base font-medium text-destructive">
              Log Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View className="px-4 py-6 items-center">
          <Text className="text-sm text-muted-foreground">
            Senior Care Connect
          </Text>
          <Text className="text-xs text-muted-foreground mt-1">
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}