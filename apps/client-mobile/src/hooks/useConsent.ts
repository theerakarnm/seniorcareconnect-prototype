import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { ConsentManager, type ConsentData } from '~/lib/consent';

interface UseConsentReturn {
  consentData: ConsentData | null;
  hasConsented: boolean;
  isLoading: boolean;
  isModalVisible: boolean;
  showModal: () => void;
  hideModal: () => void;
  acceptConsent: (preferences?: ConsentData['preferences']) => Promise<void>;
  declineConsent: () => Promise<void>;
  updateConsent: (preferences: ConsentData['preferences']) => Promise<void>;
  hasConsentForType: (type: keyof NonNullable<ConsentData['preferences']>) => boolean;
  requestTrackingPermission: () => Promise<boolean>;
}

export function useConsent(): UseConsentReturn {
  const [consentData, setConsentData] = useState<ConsentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const consentManager = ConsentManager.getInstance();

  // Load consent data on mount
  useEffect(() => {
    loadConsentData();
  }, []);

  const loadConsentData = async () => {
    try {
      setIsLoading(true);
      const data = await consentManager.getConsentData();
      setConsentData(data);

      // Show modal if no consent exists or consent is expired
      if (!data || consentManager.isConsentExpired(data)) {
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error('Error loading consent data:', error);
      setIsModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const showModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const acceptConsent = useCallback(async (preferences?: ConsentData['preferences']) => {
    try {
      await consentManager.acceptConsent(preferences);
      const data = await consentManager.getConsentData();
      setConsentData(data);
      hideModal();

      // Initialize analytics and tracking if consent is given
      if (data?.accepted && data.preferences?.analytics) {
        await initializeAnalytics();
      }

      if (data?.accepted && data.preferences?.marketing) {
        await initializeMarketing();
      }
    } catch (error) {
      console.error('Error accepting consent:', error);
    }
  }, [hideModal]);

  const declineConsent = useCallback(async () => {
    try {
      await consentManager.declineConsent();
      const data = await consentManager.getConsentData();
      setConsentData(data);
      hideModal();
    } catch (error) {
      console.error('Error declining consent:', error);
    }
  }, [hideModal]);

  const updateConsent = useCallback(async (preferences: ConsentData['preferences']) => {
    try {
      await consentManager.updateConsent(preferences);
      const data = await consentManager.getConsentData();
      setConsentData(data);

      // Update analytics and marketing based on new preferences
      if (data?.accepted) {
        if (preferences.analytics) {
          await initializeAnalytics();
        } else {
          await disableAnalytics();
        }

        if (preferences.marketing) {
          await initializeMarketing();
        } else {
          await disableMarketing();
        }
      }
    } catch (error) {
      console.error('Error updating consent:', error);
    }
  }, []);

  const hasConsentForType = useCallback((type: keyof NonNullable<ConsentData['preferences']>) => {
    return consentManager.getConsentForType(consentData, type);
  }, [consentData]);

  const requestTrackingPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      try {
        // For iOS, we would use AppTrackingTransparency
        // This requires installing expo-app-tracking-transparency
        const { requestTrackingPermissionsAsync } = await import('expo-tracking-transparency');
        const { status } = await requestTrackingPermissionsAsync();
        return status === 'granted';
      } catch (error) {
        console.error('Error requesting iOS tracking permission:', error);
        return false;
      }
    } else if (Platform.OS === 'android') {
      try {
        // For Android, we would use Google Play Consent API
        // This would require additional setup with Google Mobile Ads SDK
        return true; // Placeholder for Android implementation
      } catch (error) {
        console.error('Error requesting Android tracking permission:', error);
        return false;
      }
    }
    return false;
  }, []);

  const initializeAnalytics = useCallback(async () => {
    try {
      // Initialize analytics only if consent is given
      // This would integrate with analytics providers like:
      // - Firebase Analytics
      // - Amplitude
      // - Mixpanel
      // - Segment
      console.log('Analytics initialized with consent');
    } catch (error) {
      console.error('Error initializing analytics:', error);
    }
  }, []);

  const initializeMarketing = useCallback(async () => {
    try {
      // Initialize marketing tools only if consent is given
      // This would integrate with marketing platforms like:
      // - OneSignal (push notifications)
      // - Braze (customer engagement)
      // - Facebook SDK
      console.log('Marketing tools initialized with consent');
    } catch (error) {
      console.error('Error initializing marketing:', error);
    }
  }, []);

  const disableAnalytics = useCallback(async () => {
    try {
      // Disable analytics collection
      console.log('Analytics disabled');
    } catch (error) {
      console.error('Error disabling analytics:', error);
    }
  }, []);

  const disableMarketing = useCallback(async () => {
    try {
      // Disable marketing tools
      console.log('Marketing tools disabled');
    } catch (error) {
      console.error('Error disabling marketing:', error);
    }
  }, []);

  return {
    consentData,
    hasConsented: consentData?.accepted ?? false,
    isLoading,
    isModalVisible,
    showModal,
    hideModal,
    acceptConsent,
    declineConsent,
    updateConsent,
    hasConsentForType,
    requestTrackingPermission,
  };
}