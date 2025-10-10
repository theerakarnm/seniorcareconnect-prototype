import * as SecureStore from 'expo-secure-store';

export interface ConsentData {
  accepted: boolean;
  timestamp: number;
  version: string;
  preferences?: {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
    personalization: boolean;
  };
}

export const CONSENT_STORAGE_KEY = 'user_consent_data';
export const CONSENT_VERSION = '1.0.0';

export class ConsentManager {
  private static instance: ConsentManager;

  static getInstance(): ConsentManager {
    if (!ConsentManager.instance) {
      ConsentManager.instance = new ConsentManager();
    }
    return ConsentManager.instance;
  }

  async hasConsented(): Promise<boolean> {
    try {
      const consentData = await this.getConsentData();
      return consentData?.accepted ?? false;
    } catch (error) {
      console.error('Error checking consent:', error);
      return false;
    }
  }

  async getConsentData(): Promise<ConsentData | null> {
    try {
      const data = await SecureStore.getItemAsync(CONSENT_STORAGE_KEY);
      if (data) {
        const consentData = JSON.parse(data) as ConsentData;

        // Check if consent version is current
        if (consentData.version !== CONSENT_VERSION) {
          // Consent is outdated, require new consent
          await this.clearConsent();
          return null;
        }

        return consentData;
      }
      return null;
    } catch (error) {
      console.error('Error getting consent data:', error);
      return null;
    }
  }

  async saveConsent(consent: ConsentData): Promise<void> {
    try {
      const dataToStore = JSON.stringify(consent);
      await SecureStore.setItemAsync(CONSENT_STORAGE_KEY, dataToStore);
    } catch (error) {
      console.error('Error saving consent:', error);
      throw error;
    }
  }

  async acceptConsent(preferences?: ConsentData['preferences']): Promise<void> {
    const consentData: ConsentData = {
      accepted: true,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
      preferences: preferences || {
        essential: true,
        analytics: true,
        marketing: false,
        personalization: true,
      },
    };

    await this.saveConsent(consentData);
  }

  async declineConsent(): Promise<void> {
    const consentData: ConsentData = {
      accepted: false,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };

    await this.saveConsent(consentData);
  }

  async updateConsent(preferences: ConsentData['preferences']): Promise<void> {
    const currentData = await this.getConsentData();
    if (!currentData) {
      throw new Error('No existing consent found');
    }

    const updatedConsent: ConsentData = {
      ...currentData,
      preferences,
      timestamp: Date.now(),
    };

    await this.saveConsent(updatedConsent);
  }

  async clearConsent(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(CONSENT_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing consent:', error);
      throw error;
    }
  }

  getConsentForType(consentData: ConsentData | null, type: keyof NonNullable<ConsentData['preferences']>): boolean {
    if (!consentData || !consentData.accepted) {
      return false;
    }

    if (type === 'essential') {
      return true; // Essential cookies are always allowed if consent is given
    }

    return consentData.preferences?.[type] ?? false;
  }

  isConsentExpired(consentData: ConsentData): boolean {
    const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
    return Date.now() - consentData.timestamp > oneYearInMs;
  }
}