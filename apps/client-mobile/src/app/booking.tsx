import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Clock, User, FileText, CreditCard, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface BookingStep {
  id: string;
  title: string;
  completed: boolean;
}

export default function BookingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    serviceType: '',
    startDate: '',
    startTime: '',
    duration: '',
    specialRequirements: '',
    emergencyContact: '',
    paymentMethod: '',
  });

  const steps: BookingStep[] = [
    { id: 'service', title: 'Service Details', completed: false },
    { id: 'schedule', title: 'Schedule', completed: false },
    { id: 'requirements', title: 'Requirements', completed: false },
    { id: 'payment', title: 'Payment', completed: false },
  ];

  const serviceTypes = [
    'Nursing Care',
    'Physical Therapy',
    'Memory Care',
    'Assisted Living',
    'Home Care',
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM',
  ];

  const durations = ['1 month', '3 months', '6 months', '1 year', 'Ongoing'];

  const renderServiceStep = () => (
    <View className="space-y-4">
      <Text className="text-lg font-semibold text-foreground mb-4">
        Select Service Type
      </Text>
      {serviceTypes.map((service) => (
        <TouchableOpacity
          key={service}
          onPress={() => setBookingData({ ...bookingData, serviceType: service })}
          className={`p-4 rounded-lg border ${
            bookingData.serviceType === service
              ? 'border-primary bg-primary/10'
              : 'border-border bg-card'
          }`}
        >
          <View className="flex-row justify-between items-center">
            <Text className="text-base text-foreground">{service}</Text>
            {bookingData.serviceType === service && (
              <Check size={20} className="text-primary" />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderScheduleStep = () => (
    <View className="space-y-6">
      <View>
        <Text className="text-lg font-semibold text-foreground mb-4">
          Start Date
        </Text>
        <TouchableOpacity className="flex-row items-center p-4 border border-border rounded-lg bg-card">
          <Calendar size={20} className="text-muted-foreground" />
          <TextInput
            className="ml-3 flex-1 text-foreground"
            placeholder="Select start date"
            value={bookingData.startDate}
            onChangeText={(text) => setBookingData({ ...bookingData, startDate: text })}
            placeholderTextColor="#9ca3af"
          />
        </TouchableOpacity>
      </View>

      <View>
        <Text className="text-lg font-semibold text-foreground mb-4">
          Preferred Time
        </Text>
        <View className="grid grid-cols-3 gap-3">
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              onPress={() => setBookingData({ ...bookingData, startTime: time })}
              className={`p-3 rounded-lg border ${
                bookingData.startTime === time
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card'
              }`}
            >
              <Text
                className={`text-center ${
                  bookingData.startTime === time
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View>
        <Text className="text-lg font-semibold text-foreground mb-4">
          Duration
        </Text>
        {durations.map((duration) => (
          <TouchableOpacity
            key={duration}
            onPress={() => setBookingData({ ...bookingData, duration })}
            className={`p-4 rounded-lg border mb-2 ${
              bookingData.duration === duration
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card'
            }`}
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-base text-foreground">{duration}</Text>
              {bookingData.duration === duration && (
                <Check size={20} className="text-primary" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderRequirementsStep = () => (
    <View className="space-y-6">
      <View>
        <Text className="text-lg font-semibold text-foreground mb-4">
          Special Requirements
        </Text>
        <TextInput
          className="p-4 border border-border rounded-lg bg-card text-foreground min-h-[100px]"
          placeholder="Tell us about any special requirements or needs..."
          value={bookingData.specialRequirements}
          onChangeText={(text) => setBookingData({ ...bookingData, specialRequirements: text })}
          multiline
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View>
        <Text className="text-lg font-semibold text-foreground mb-4">
          Emergency Contact
        </Text>
        <TextInput
          className="p-4 border border-border rounded-lg bg-card text-foreground mb-3"
          placeholder="Emergency contact name"
          value={bookingData.emergencyContact}
          onChangeText={(text) => setBookingData({ ...bookingData, emergencyContact: text })}
          placeholderTextColor="#9ca3af"
        />
        <TextInput
          className="p-4 border border-border rounded-lg bg-card text-foreground"
          placeholder="Emergency contact phone"
          keyboardType="phone-pad"
          placeholderTextColor="#9ca3af"
        />
      </View>
    </View>
  );

  const renderPaymentStep = () => (
    <View className="space-y-4">
      <Text className="text-lg font-semibold text-foreground mb-4">
        Payment Method
      </Text>

      <TouchableOpacity className="p-4 border border-border rounded-lg bg-card">
        <View className="flex-row items-center">
          <CreditCard size={20} className="text-muted-foreground" />
          <Text className="ml-3 text-foreground">Credit/Debit Card</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity className="p-4 border border-border rounded-lg bg-card">
        <View className="flex-row items-center">
          <FileText size={20} className="text-muted-foreground" />
          <Text className="ml-3 text-foreground">Bank Transfer</Text>
        </View>
      </TouchableOpacity>

      <View className="mt-6 p-4 bg-muted rounded-lg">
        <Text className="text-sm text-muted-foreground mb-2">
          Booking Summary
        </Text>
        <Text className="text-base text-foreground font-medium">
          Service: {bookingData.serviceType || 'Not selected'}
        </Text>
        <Text className="text-sm text-muted-foreground">
          Duration: {bookingData.duration || 'Not selected'}
        </Text>
        <Text className="text-sm text-muted-foreground">
          Start: {bookingData.startDate || 'Not selected'} at {bookingData.startTime || 'Not selected'}
        </Text>
      </View>
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderServiceStep();
      case 1:
        return renderScheduleStep();
      case 2:
        return renderRequirementsStep();
      case 3:
        return renderPaymentStep();
      default:
        return null;
    }
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 0:
        return bookingData.serviceType !== '';
      case 1:
        return bookingData.startDate !== '' && bookingData.startTime !== '' && bookingData.duration !== '';
      case 2:
        return bookingData.specialRequirements !== '';
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 py-4 border-b border-border">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} className="text-foreground" />
          </TouchableOpacity>
          <Text className="ml-4 text-lg font-semibold text-foreground">
            Book Service
          </Text>
        </View>

        {/* Progress Steps */}
        <View className="px-4 py-4 bg-muted border-b border-border">
          <View className="flex-row justify-between">
            {steps.map((step, index) => (
              <View key={step.id} className="flex-1 items-center">
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    index <= currentStep ? 'bg-primary' : 'bg-muted border border-border'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      index <= currentStep ? 'text-primary-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </Text>
                </View>
                <Text
                  className={`text-xs mt-2 text-center ${
                    index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Step Content */}
        <ScrollView className="flex-1 px-4 py-6">
          {renderStepContent()}
        </ScrollView>

        {/* Navigation Buttons */}
        <View className="px-4 py-4 bg-background border-t border-border">
          <View className="flex-row gap-3">
            {currentStep > 0 && (
              <TouchableOpacity
                onPress={() => setCurrentStep(currentStep - 1)}
                className="flex-1 border border-border py-3 rounded-lg"
              >
                <Text className="text-foreground text-center font-medium">
                  Previous
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                if (currentStep < steps.length - 1) {
                  setCurrentStep(currentStep + 1);
                } else {
                  // Complete booking
                  router.push('/my-bookings');
                }
              }}
              disabled={!canGoNext()}
              className={`flex-1 py-3 rounded-lg ${
                canGoNext()
                  ? 'bg-primary'
                  : 'bg-muted border border-border'
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  canGoNext()
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {currentStep === steps.length - 1 ? 'Complete Booking' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}