import { Redirect, Tabs } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Chrome as Home, Search, Calendar, User } from 'lucide-react-native';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#f472b6',
        tabBarInactiveTintColor: isDark ? '#9ca3af' : '#6b7280',
        tabBarStyle: {
          backgroundColor: isDark ? '#09090b' : '#ffffff',
          borderTopColor: isDark ? '#27272a' : '#e5e7eb',
        },
        headerStyle: {
          backgroundColor: isDark ? '#09090b' : '#ffffff',
        },
        headerTintColor: isDark ? '#ffffff' : '#000000',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          href: '/(tabs)/home',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
          href: '/(tabs)/search',
        }}
      />
      <Tabs.Screen
        name="my-bookings"
        options={{
          title: 'My Bookings',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
          href: '/(tabs)/my-bookings',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          href: '/(tabs)/profile',
        }}
      />
    </Tabs>
  );
}