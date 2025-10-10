import { Platform } from 'react-native';

// Type declarations for optional tracking libraries
declare module 'expo-tracking-transparency' {
  export function requestTrackingPermissionsAsync(): Promise<{
    status: string;
    granted: boolean;
  }>;
  export function getTrackingPermissionsAsync(): Promise<{
    status: string;
    granted: boolean;
  }>;
}

declare module 'expo-intent-launcher' {
  export const IntentAction: {
    ACTION_APPLICATION_DETAILS_SETTINGS: string;
  };
  export function startActivityAsync(action: string): Promise<void>;
}

export interface TrackingPermission {
  status: 'granted' | 'denied' | 'not_determined' | 'restricted';
  canTrack: boolean;
}

export class TrackingPermissionManager {
  private static instance: TrackingPermissionManager;

  static getInstance(): TrackingPermissionManager {
    if (!TrackingPermissionManager.instance) {
      TrackingPermissionManager.instance = new TrackingPermissionManager();
    }
    return TrackingPermissionManager.instance;
  }

  async requestTrackingPermission(): Promise<TrackingPermission> {
    if (Platform.OS === 'ios') {
      return this.requestIOSTrackingPermission();
    } else if (Platform.OS === 'android') {
      return this.requestAndroidTrackingPermission();
    }

    // Other platforms default to not tracking
    return {
      status: 'not_determined',
      canTrack: false,
    };
  }

  private async requestIOSTrackingPermission(): Promise<TrackingPermission> {
    try {
      // Import dynamically to avoid bundling issues if not installed
      const { requestTrackingPermissionsAsync } = await import('expo-tracking-transparency');
      const { status, granted } = await requestTrackingPermissionsAsync();

      return {
        status: status as TrackingPermission['status'],
        canTrack: granted,
      };
    } catch (error) {
      console.warn('App Tracking Transparency not available:', error);

      // Fallback: check consent data instead
      const { ConsentManager } = await import('./consent');
      const consentManager = ConsentManager.getInstance();
      const consentData = await consentManager.getConsentData();

      const canTrack = (consentData?.accepted && consentData?.preferences?.analytics) ?? false;

      return {
        status: canTrack ? 'granted' : 'denied',
        canTrack,
      };
    }
  }

  private async requestAndroidTrackingPermission(): Promise<TrackingPermission> {
    try {
      // For Android, we would integrate with Google Play Consent API
      // This is a placeholder implementation
      // In production, you would use:
      // - Google Mobile Ads SDK consent management
      // - Android Advertising ID

      // Check if user has consented to analytics (from our PDPA flow)
      const { ConsentManager } = await import('./consent');
      const consentManager = ConsentManager.getInstance();
      const consentData = await consentManager.getConsentData();

      const canTrack = (consentData?.accepted && consentData?.preferences?.analytics) ?? false;

      return {
        status: canTrack ? 'granted' : 'denied',
        canTrack,
      };
    } catch (error) {
      console.warn('Android tracking permission check failed:', error);
      return {
        status: 'not_determined',
        canTrack: false,
      };
    }
  }

  async getTrackingPermissionStatus(): Promise<TrackingPermission> {
    if (Platform.OS === 'ios') {
      try {
        const { getTrackingPermissionsAsync } = await import('expo-tracking-transparency');
        const { status, granted } = await getTrackingPermissionsAsync();

        return {
          status: status as TrackingPermission['status'],
          canTrack: granted,
        };
      } catch (error) {
        console.warn('Could not get iOS tracking permission:', error);
        return {
          status: 'not_determined',
          canTrack: false,
        };
      }
    } else if (Platform.OS === 'android') {
      // For Android, check consent data
      try {
        const { ConsentManager } = await import('./consent');
        const consentManager = ConsentManager.getInstance();
        const consentData = await consentManager.getConsentData();

        const canTrack = (consentData?.accepted && consentData?.preferences?.analytics) ?? false;

        return {
          status: canTrack ? 'granted' : 'denied',
          canTrack,
        };
      } catch (error) {
        console.warn('Could not get Android tracking permission:', error);
        return {
          status: 'not_determined',
          canTrack: false,
        };
      }
    }

    return {
      status: 'not_determined',
      canTrack: false,
    };
  }

  async openAppSettings(): Promise<void> {
    try {
      if (Platform.OS === 'ios') {
        const { openURL } = await import('expo-linking');
        await openURL('app-settings:');
      } else if (Platform.OS === 'android') {
        const { IntentAction } = await import('expo-intent-launcher');
        // Open app settings for Android
        await IntentAction.startActivityAsync(IntentAction.ACTION_APPLICATION_DETAILS_SETTINGS);
      }
    } catch (error) {
      console.warn('Could not open app settings:', error);
    }
  }
}

// Hook for using tracking permissions
export const useTrackingPermissions = () => {
  const manager = TrackingPermissionManager.getInstance();

  return {
    requestPermission: () => manager.requestTrackingPermission(),
    getStatus: () => manager.getTrackingPermissionStatus(),
    openSettings: () => manager.openAppSettings(),
  };
};