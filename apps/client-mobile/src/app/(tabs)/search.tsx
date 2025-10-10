import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, MapPin, Calendar, Star } from 'lucide-react-native';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filters = [
    'Nursing Care',
    'Physical Therapy',
    'Memory Care',
    'Assisted Living',
    'Home Care',
  ];

  const mockResults = [
    {
      id: 1,
      name: 'Bangkok Senior Care Center',
      type: 'Nursing Care',
      location: 'Sukhumvit, Bangkok',
      rating: 4.8,
      price: '฿18,000/month',
      image: null,
    },
    {
      id: 2,
      name: 'Thonburi Care Home',
      type: 'Assisted Living',
      location: 'Thonburi, Bangkok',
      rating: 4.6,
      price: '฿12,000/month',
      image: null,
    },
    {
      id: 3,
      name: 'Chao Phraya Senior Residence',
      type: 'Memory Care',
      location: 'Riverside, Bangkok',
      rating: 4.9,
      price: '฿22,000/month',
      image: null,
    },
  ];

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Search Header */}
        <View className="px-4 py-4 border-b border-border">
          <View className="flex-row items-center rounded-lg border border-border bg-muted px-4 py-3">
            <Search size={20} className="text-muted-foreground" />
            <TextInput
              className="ml-3 flex-1 text-foreground"
              placeholder="Search care services..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Filter Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
            <View className="flex-row gap-2">
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  onPress={() => toggleFilter(filter)}
                  className={`rounded-full px-4 py-2 ${
                    selectedFilters.includes(filter)
                      ? 'bg-primary'
                      : 'bg-muted border border-border'
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      selectedFilters.includes(filter)
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Search Results */}
        <ScrollView className="flex-1 px-4 py-4">
          <Text className="mb-3 text-lg font-semibold text-foreground">
            Search Results ({mockResults.length})
          </Text>

          <View className="space-y-4">
            {mockResults.map((result) => (
              <TouchableOpacity
                key={result.id}
                className="rounded-lg border border-border bg-card p-4 shadow-sm"
              >
                <View className="h-32 w-full rounded-lg bg-muted mb-3" />

                <View className="flex-row justify-between items-start mb-2">
                  <Text className="text-lg font-semibold text-foreground flex-1">
                    {result.name}
                  </Text>
                  <View className="flex-row items-center">
                    <Star size={16} className="text-yellow-500" />
                    <Text className="ml-1 text-sm text-foreground">
                      {result.rating}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center mb-2">
                  <MapPin size={16} className="text-muted-foreground" />
                  <Text className="ml-1 text-sm text-muted-foreground">
                    {result.location}
                  </Text>
                </View>

                <View className="flex-row items-center mb-2">
                  <Calendar size={16} className="text-muted-foreground" />
                  <Text className="ml-1 text-sm text-muted-foreground">
                    {result.type}
                  </Text>
                </View>

                <Text className="text-primary font-semibold">
                  {result.price}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}