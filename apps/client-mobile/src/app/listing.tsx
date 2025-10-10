import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Filter, MapPin, Star, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const mockListings = [
  {
    id: '1',
    name: 'Bangkok Senior Care Center',
    type: 'Nursing Care',
    location: 'Sukhumvit, Bangkok',
    rating: 4.8,
    reviewCount: 127,
    price: '฿18,000/month',
    image: null,
    description: 'Premium 24/7 nursing care with medical supervision',
    availability: 'Immediate',
  },
  {
    id: '2',
    name: 'Thonburi Care Home',
    type: 'Assisted Living',
    location: 'Thonburi, Bangkok',
    rating: 4.6,
    reviewCount: 89,
    price: '฿12,000/month',
    image: null,
    description: 'Comfortable assisted living with daily support',
    availability: 'Within 2 weeks',
  },
  {
    id: '3',
    name: 'Chao Phraya Senior Residence',
    type: 'Memory Care',
    location: 'Riverside, Bangkok',
    rating: 4.9,
    reviewCount: 156,
    price: '฿22,000/month',
    image: null,
    description: 'Specialized memory care for dementia patients',
    availability: 'Within 1 month',
  },
  {
    id: '4',
    name: 'Sathorn Wellness Center',
    type: 'Physical Therapy',
    location: 'Sathorn, Bangkok',
    rating: 4.7,
    reviewCount: 203,
    price: '฿3,500/session',
    image: null,
    description: 'Rehabilitation and physical therapy services',
    availability: 'This week',
  },
];

export default function ListingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 py-4 border-b border-border">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} className="text-foreground" />
          </TouchableOpacity>
          <Text className="ml-4 text-lg font-semibold text-foreground flex-1">
            Search Results
          </Text>
          <TouchableOpacity className="p-2">
            <Filter size={20} className="text-foreground" />
          </TouchableOpacity>
        </View>

        {/* Results Count */}
        <View className="px-4 py-3 bg-muted border-b border-border">
          <Text className="text-sm text-muted-foreground">
            Found {mockListings.length} care services
          </Text>
        </View>

        {/* Listings */}
        <ScrollView className="flex-1 px-4 py-4">
          <View className="space-y-4">
            {mockListings.map((listing) => (
              <TouchableOpacity
                key={listing.id}
                onPress={() => router.push(`/details?id=${listing.id}`)}
                className="rounded-lg border border-border bg-card overflow-hidden shadow-sm"
              >
                <View className="h-48 bg-muted" />

                <View className="p-4">
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-lg font-semibold text-foreground flex-1">
                      {listing.name}
                    </Text>
                    <View className="flex-row items-center">
                      <Star size={16} className="text-yellow-500" />
                      <Text className="ml-1 text-sm text-foreground">
                        {listing.rating}
                      </Text>
                      <Text className="ml-1 text-xs text-muted-foreground">
                        ({listing.reviewCount})
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center mb-2">
                    <MapPin size={16} className="text-muted-foreground" />
                    <Text className="ml-1 text-sm text-muted-foreground">
                      {listing.location}
                    </Text>
                  </View>

                  <Text className="text-sm text-muted-foreground mb-3">
                    {listing.description}
                  </Text>

                  <View className="flex-row justify-between items-center">
                    <Text className="text-lg font-semibold text-primary">
                      {listing.price}
                    </Text>
                    <View className="flex-row items-center">
                      <Calendar size={16} className="text-muted-foreground" />
                      <Text className="ml-1 text-xs text-muted-foreground">
                        {listing.availability}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}