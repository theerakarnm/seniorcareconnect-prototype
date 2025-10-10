import { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { X, Shield, Eye, Lock, Database } from 'lucide-react-native';

interface ConsentOption {
  id: string;
  title: string;
  description: string;
  required: boolean;
  enabled: boolean;
  onToggle?: () => void;
}

interface PDPAConsentModalProps {
  visible: boolean;
  onAccept: (preferences?: ConsentOption[]) => void;
  onDecline: () => void;
}

export default function PDPAConsentModal({
  visible,
  onAccept,
  onDecline,
}: PDPAConsentModalProps) {
  const [consentOptions, setConsentOptions] = useState<ConsentOption[]>([
    {
      id: 'essential',
      title: 'Essential Cookies',
      description: 'Required for the app to function properly',
      required: true,
      enabled: true,
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Help us improve our services by collecting usage data',
      required: false,
      enabled: true,
    },
    {
      id: 'marketing',
      title: 'Marketing Communications',
      description: 'Receive updates about our services and promotions',
      required: false,
      enabled: false,
    },
    {
      id: 'personalization',
      title: 'Personalization',
      description: 'Personalize your experience based on your preferences',
      required: false,
      enabled: true,
    },
  ]);

  const toggleOption = (id: string) => {
    setConsentOptions(prev =>
      prev.map(option =>
        option.id === id ? { ...option, enabled: !option.enabled } : option
      )
    );
  };

  const handleAccept = (customizeSettings = false) => {
    if (customizeSettings) {
      onAccept(consentOptions);
    } else {
      onAccept();
    }
  };

  const handleDecline = () => {
    onDecline();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-border">
          <View className="flex-row items-center">
            <Shield size={24} className="text-primary mr-3" />
            <Text className="text-xl font-bold text-foreground">
              Privacy Consent
            </Text>
          </View>
          <TouchableOpacity onPress={handleDecline}>
            <X size={24} className="text-muted-foreground" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-6 py-6">
          <View className="mb-6">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Your Privacy Matters
            </Text>
            <Text className="text-muted-foreground leading-relaxed">
              Senior Care Connect is committed to protecting your personal data in accordance with Thailand's Personal Data Protection Act (PDPA). We collect and use your information to provide and improve our services.
            </Text>
          </View>

          {/* What We Collect */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-foreground mb-3">
              What We Collect
            </Text>
            <View className="space-y-3">
              <View className="flex-row items-start">
                <Database size={20} className="text-muted-foreground mr-3 mt-1" />
                <View className="flex-1">
                  <Text className="text-sm font-medium text-foreground">
                    Personal Information
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Name, email, phone number, and contact details
                  </Text>
                </View>
              </View>
              <View className="flex-row items-start">
                <Eye size={20} className="text-muted-foreground mr-3 mt-1" />
                <View className="flex-1">
                  <Text className="text-sm font-medium text-foreground">
                    Usage Data
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    How you interact with our app and services
                  </Text>
                </View>
              </View>
              <View className="flex-row items-start">
                <Lock size={20} className="text-muted-foreground mr-3 mt-1" />
                <View className="flex-1">
                  <Text className="text-sm font-medium text-foreground">
                    Health Information
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Care preferences and requirements (with explicit consent)
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Consent Options */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-foreground mb-3">
              Your Preferences
            </Text>
            <View className="space-y-3">
              {consentOptions.map((option) => (
                <View
                  key={option.id}
                  className="p-4 border border-border rounded-lg bg-card"
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 mr-3">
                      <View className="flex-row items-center">
                        <Text className="text-sm font-medium text-foreground">
                          {option.title}
                        </Text>
                        {option.required && (
                          <Text className="ml-2 text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                            Required
                          </Text>
                        )}
                      </View>
                      <Text className="text-sm text-muted-foreground mt-1">
                        {option.description}
                      </Text>
                    </View>
                    {!option.required && (
                      <TouchableOpacity
                        onPress={() => toggleOption(option.id)}
                        className={`w-12 h-6 rounded-full p-1 ${option.enabled ? 'bg-primary' : 'bg-muted'
                          }`}
                      >
                        <View
                          className={`w-4 h-4 rounded-full bg-white ${option.enabled ? 'translate-x-6' : 'translate-x-0'
                            }`}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Rights */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-foreground mb-3">
              Your Rights
            </Text>
            <Text className="text-sm text-muted-foreground leading-relaxed">
              Under PDPA, you have the right to:
              {'\n\n'}• Access your personal data
              {'\n'}• Request correction of inaccurate data
              {'\n'}• Request deletion of your data
              {'\n'}• Object to processing of your data
              {'\n'}• Data portability
              {'\n'}• Withdraw consent at any time
            </Text>
          </View>

          {/* Contact */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-foreground mb-3">
              Questions?
            </Text>
            <Text className="text-sm text-muted-foreground leading-relaxed">
              For questions about our privacy practices or to exercise your rights, contact us at privacy@seniorcareconnect.com or call +66 2 123 4567.
            </Text>
          </View>
        </ScrollView>

        {/* Actions */}
        <View className="px-6 py-4 border-t border-border">
          <View className="space-y-3">
            <TouchableOpacity
              onPress={() => handleAccept(false)}
              className="w-full bg-primary py-4 rounded-lg"
            >
              <Text className="text-primary-foreground text-center font-semibold">
                Accept All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleAccept(true)}
              className="w-full border border-primary py-4 rounded-lg"
            >
              <Text className="text-primary text-center font-semibold">
                Customize Settings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDecline}
              className="w-full py-4"
            >
              <Text className="text-muted-foreground text-center">
                Decline
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}