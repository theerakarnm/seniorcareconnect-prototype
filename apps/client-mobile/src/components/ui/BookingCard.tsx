import { TouchableOpacity, View, Text } from 'react-native';
import { Calendar, Clock, MapPin, Star, ChevronRight } from 'lucide-react-native';

interface Booking {
  id: string;
  serviceName: string;
  provider: string;
  date: string;
  time?: string;
  location?: string;
  status: 'DRAFT' | 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  totalPrice: number;
  service?: {
    rating?: number;
    location?: string;
  };
}

interface BookingCardProps {
  booking: Booking;
  onPress?: (booking: Booking) => void;
}

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
};

const statusLabels = {
  DRAFT: 'Draft',
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
};

export function BookingCard({ booking, onPress }: BookingCardProps) {
  const handlePress = () => {
    onPress?.(booking);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="rounded-lg border border-border bg-card p-4 shadow-sm"
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-foreground">
            {booking.serviceName || 'Service Booking'}
          </Text>
          <Text className="text-sm text-muted-foreground mt-1">
            {booking.provider || 'Service Provider'}
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
            {new Date(booking.date).toLocaleDateString()}
          </Text>
        </View>

        {booking.time && (
          <View className="flex-row items-center">
            <Clock size={16} className="text-muted-foreground" />
            <Text className="ml-2 text-sm text-foreground">
              {booking.time}
            </Text>
          </View>
        )}

        {(booking.service?.location || booking.location) && (
          <View className="flex-row items-center">
            <MapPin size={16} className="text-muted-foreground" />
            <Text className="ml-2 text-sm text-foreground">
              {booking.service?.location || booking.location}
            </Text>
          </View>
        )}

        {booking.service?.rating && (
          <View className="flex-row items-center">
            <Star size={16} className="text-yellow-500" />
            <Text className="ml-1 text-sm text-foreground">
              {booking.service.rating.toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-border">
        <Text className="text-lg font-semibold text-primary">
          ฿{booking.totalPrice.toLocaleString()}
        </Text>
        <ChevronRight size={20} className="text-muted-foreground" />
      </View>
    </TouchableOpacity>
  );
}