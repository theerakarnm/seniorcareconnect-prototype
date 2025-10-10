import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, MapPin, Phone, Mail, Calendar, Heart, Share2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const mockDetails = {
  id: '1',
  name: 'Bangkok Senior Care Center',
  type: 'Nursing Care',
  location: 'Sukhumvit, Bangkok',
  rating: 4.8,
  reviewCount: 127,
  price: '฿18,000/month',
  images: [null, null, null, null],
  description: 'Premium 24/7 nursing care facility providing comprehensive medical supervision and personalized care for seniors. Our state-of-the-art facility is equipped with modern medical equipment and staffed by experienced healthcare professionals.',
  services: [
    '24/7 Medical Supervision',
    'Medication Management',
    'Physical Therapy',
    'Occupational Therapy',
    'Nutritional Planning',
    'Social Activities',
    'Transportation Services',
  ],
  amenities: [
    'Private Rooms',
    'Dining Hall',
    'Recreation Area',
    'Garden',
    'Medical Room',
    'Emergency Response System',
  ],
  availability: 'Immediate',
  contact: {
    phone: '+66 2 123 4567',
    email: 'info@bangkokseniorcare.com',
  },
};

export default function DetailsScreen() {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header Image */}
        <View className="relative">
          <View className="h-64 bg-muted" />
          <View className="absolute top-4 left-4 right-4 flex-row justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-black/50 items-center justify-center"
            >
              <ArrowLeft size={20} className="text-white" />
            </TouchableOpacity>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setIsFavorite(!isFavorite)}
                className="w-10 h-10 rounded-full bg-black/50 items-center justify-center"
              >
                <Heart
                  size={20}
                  className={isFavorite ? "text-red-500" : "text-white"}
                  fill={isFavorite ? "#ef4444" : "none"}
                />
              </TouchableOpacity>
              <TouchableOpacity className="w-10 h-10 rounded-full bg-black/50 items-center justify-center">
                <Share2 size={20} className="text-white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Basic Info */}
        <View className="px-4 py-4 border-b border-border">
          <Text className="text-2xl font-bold text-foreground">
            {mockDetails.name}
          </Text>
          <Text className="text-muted-foreground mt-1">
            {mockDetails.type}
          </Text>

          <View className="flex-row items-center mt-2">
            <View className="flex-row items-center">
              <Star size={16} className="text-yellow-500" />
              <Text className="ml-1 text-foreground font-medium">
                {mockDetails.rating}
              </Text>
              <Text className="ml-1 text-muted-foreground">
                ({mockDetails.reviewCount} reviews)
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mt-2">
            <MapPin size={16} className="text-muted-foreground" />
            <Text className="ml-1 text-muted-foreground">
              {mockDetails.location}
            </Text>
          </View>

          <View className="flex-row justify-between items-center mt-3">
            <Text className="text-2xl font-bold text-primary">
              {mockDetails.price}
            </Text>
            <View className="flex-row items-center">
              <Calendar size={16} className="text-green-600" />
              <Text className="ml-1 text-green-600 font-medium">
                {mockDetails.availability}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View className="px-4 py-4 border-b border-border">
          <Text className="text-lg font-semibold text-foreground mb-3">
            About
          </Text>
          <Text className="text-muted-foreground leading-relaxed">
            {mockDetails.description}
          </Text>
        </View>

        {/* Services */}
        <View className="px-4 py-4 border-b border-border">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Services
          </Text>
          <View className="grid grid-cols-2 gap-3">
            {mockDetails.services.map((service, index) => (
              <View key={index} className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-primary mr-2" />
                <Text className="text-sm text-muted-foreground flex-1">
                  {service}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Amenities */}
        <View className="px-4 py-4 border-b border-border">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Amenities
          </Text>
          <View className="grid grid-cols-2 gap-3">
            {mockDetails.amenities.map((amenity, index) => (
              <View key={index} className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-primary mr-2" />
                <Text className="text-sm text-muted-foreground flex-1">
                  {amenity}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact */}
        <View className="px-4 py-4 mb-20">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Contact Information
          </Text>
          <View className="space-y-3">
            <View className="flex-row items-center">
              <Phone size={20} className="text-muted-foreground" />
              <Text className="ml-3 text-muted-foreground">
                {mockDetails.contact.phone}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Mail size={20} className="text-muted-foreground" />
              <Text className="ml-3 text-muted-foreground">
                {mockDetails.contact.email}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-3">
        <View className="flex-row gap-3">
          <TouchableOpacity className="flex-1 bg-primary py-3 rounded-lg">
            <Text className="text-primary-foreground text-center font-semibold">
              Book Now
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 border border-primary py-3 rounded-lg">
            <Text className="text-primary text-center font-semibold">
              Schedule Tour
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}