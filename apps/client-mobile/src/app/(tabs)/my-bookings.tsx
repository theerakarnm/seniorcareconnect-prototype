import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react-native';

type BookingStatus = 'draft' | 'pending' | 'confirmed';

interface Booking {
  id: string;
  serviceName: string;
  provider: string;
  date: string;
  time: string;
  location: string;
  status: BookingStatus;
  price: string;
}

const mockBookings: Booking[] = [
  {
    id: '1',
    serviceName: 'Premium Senior Care',
    provider: 'Bangkok Senior Care Center',
    date: '2024-01-15',
    time: '10:00 AM',
    location: 'Sukhumvit, Bangkok',
    status: 'confirmed',
    price: '฿18,000',
  },
  {
    id: '2',
    serviceName: 'Physical Therapy Session',
    provider: 'Thonburi Care Home',
    date: '2024-01-18',
    time: '2:00 PM',
    location: 'Thonburi, Bangkok',
    status: 'pending',
    price: '฿1,500',
  },
  {
    id: '3',
    serviceName: 'Memory Care Consultation',
    provider: 'Chao Phraya Senior Residence',
    date: '2024-01-20',
    time: '3:30 PM',
    location: 'Riverside, Bangkok',
    status: 'draft',
    price: '฿2,000',
  },
];

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
};

const statusLabels = {
  draft: 'Draft',
  pending: 'Pending',
  confirmed: 'Confirmed',
};

export default function MyBookingsScreen() {
  const [selectedTab, setSelectedTab] = useState<BookingStatus>('confirmed');

  const filteredBookings = mockBookings.filter(
    booking => booking.status === selectedTab
  );

  const tabs: BookingStatus[] = ['confirmed', 'pending', 'draft'];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="px-4 py-4 border-b border-border">
          <Text className="text-2xl font-bold text-foreground">
            My Bookings
          </Text>
        </View>

        {/* Status Tabs */}
        <View className="flex-row px-4 py-3 bg-muted border-b border-border">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab)}
              className={`flex-1 py-2 px-3 rounded-lg ${
                selectedTab === tab
                  ? 'bg-primary'
                  : 'bg-transparent'
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  selectedTab === tab
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {statusLabels[tab]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bookings List */}
        <ScrollView className="flex-1 px-4 py-4">
          {filteredBookings.length === 0 ? (
            <View className="flex-1 items-center justify-center py-12">
              <Calendar size={48} className="text-muted-foreground mb-4" />
              <Text className="text-lg text-muted-foreground text-center">
                No {statusLabels[selectedTab].toLowerCase()} bookings
              </Text>
              <Text className="text-sm text-muted-foreground text-center mt-2">
                {selectedTab === 'confirmed' && 'Your confirmed bookings will appear here'}
                {selectedTab === 'pending' && 'Your pending bookings will appear here'}
                {selectedTab === 'draft' && 'Your draft bookings will appear here'}
              </Text>
            </View>
          ) : (
            <View className="space-y-4">
              {filteredBookings.map((booking) => (
                <TouchableOpacity
                  key={booking.id}
                  className="rounded-lg border border-border bg-card p-4 shadow-sm"
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-foreground">
                        {booking.serviceName}
                      </Text>
                      <Text className="text-sm text-muted-foreground mt-1">
                        {booking.provider}
                      </Text>
                    </View>
                    <View className={`px-2 py-1 rounded-full ${statusColors[booking.status]}`}>
                      <Text className="text-xs font-medium">
                        {statusLabels[booking.status]}
                      </Text>
                    </View>
                  </View>

                  <View className="space-y-2">
                    <View className="flex-row items-center">
                      <Calendar size={16} className="text-muted-foreground" />
                      <Text className="ml-2 text-sm text-foreground">
                        {booking.date}
                      </Text>
                    </View>

                    <View className="flex-row items-center">
                      <Clock size={16} className="text-muted-foreground" />
                      <Text className="ml-2 text-sm text-foreground">
                        {booking.time}
                      </Text>
                    </View>

                    <View className="flex-row items-center">
                      <MapPin size={16} className="text-muted-foreground" />
                      <Text className="ml-2 text-sm text-foreground">
                        {booking.location}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-border">
                    <Text className="text-lg font-semibold text-primary">
                      {booking.price}
                    </Text>
                    <ChevronRight size={20} className="text-muted-foreground" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}