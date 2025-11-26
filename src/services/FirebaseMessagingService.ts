import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FCM_TOKEN_KEY = '@fcm_token';

class FirebaseMessagingService {
  private static instance: FirebaseMessagingService;
  private fcmToken: string | null = null;
  private unsubscribeTokenRefresh: (() => void) | null = null;

  private constructor() {}

  public static getInstance(): FirebaseMessagingService {
    if (!FirebaseMessagingService.instance) {
      FirebaseMessagingService.instance = new FirebaseMessagingService();
    }
    return FirebaseMessagingService.instance;
  }

  /**
   * Initialize Firebase Messaging
   * Call this in your App.tsx or index.js
   */
  public async initialize(): Promise<void> {
    try {
      // Request permission
      const authStatus = await this.requestPermission();
      
      if (authStatus) {
        // Get FCM token
        await this.getFCMToken();
        
        // Listen for token refresh
        this.listenToTokenRefresh();
        
        // Setup notification handlers
        this.setupNotificationHandlers();
        
        console.log('Firebase Messaging initialized successfully');
      } else {
        console.warn('Firebase Messaging permission denied');
      }
    } catch (error) {
      console.error('Firebase Messaging initialization error:', error);
    }
  }

  /**
   * Request notification permission
   */
  public async requestPermission(): Promise<boolean> {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }

      return enabled;
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  }

  /**
   * Get FCM Token
   * Returns the device FCM token for push notifications
   */
  public async getFCMToken(): Promise<string | null> {
    try {
      // Check if token exists in memory
      if (this.fcmToken) {
        return this.fcmToken;
      }

      // Try to get from AsyncStorage
      const storedToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);
      if (storedToken) {
        this.fcmToken = storedToken;
        return storedToken;
      }

      // Get new token from Firebase
      const token = await messaging().getToken();
      
      if (token) {
        this.fcmToken = token;
        await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
        console.log('FCM Token:', token);
        
        // Trigger device registration with new token
        this.triggerDeviceRegistration();
        
        return token;
      }

      return null;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  /**
   * Listen to token refresh
   * This is called when the token is refreshed by Firebase
   */
  private listenToTokenRefresh(): void {
    this.unsubscribeTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
      console.log('FCM Token refreshed:', newToken);
      
      this.fcmToken = newToken;
      await AsyncStorage.setItem(FCM_TOKEN_KEY, newToken);
      
      // Trigger device registration with new token
      this.triggerDeviceRegistration();
    });
  }

  /**
   * Trigger device registration
   * This will be called after token is obtained or refreshed
   */
  private async triggerDeviceRegistration(): Promise<void> {
    try {
      // Delay import to avoid circular dependency
      const DeviceRegistrationService = (await import('./DeviceRegistrationService')).default;
      await DeviceRegistrationService.registerDevice();
    } catch (error) {
      console.error('Error triggering device registration:', error);
    }
  }

  /**
   * Send token to your backend server (deprecated - use DeviceRegistrationService)
   * @deprecated Use DeviceRegistrationService.registerDevice() instead
   */
  private async sendTokenToServer(token: string): Promise<void> {
    try {
      // TODO: Replace with your actual API endpoint
      // const response = await fetch('YOUR_API_ENDPOINT/device-tokens', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // Add your auth headers here
      //   },
      //   body: JSON.stringify({
      //     token,
      //     platform: Platform.OS,
      //     deviceId: await DeviceInfo.getUniqueId(),
      //   }),
      // });
      
      console.log('Token sent to server:', token);
    } catch (error) {
      console.error('Error sending token to server:', error);
    }
  }

  /**
   * Delete FCM Token
   * Call this when user logs out
   */
  public async deleteToken(): Promise<void> {
    try {
      await messaging().deleteToken();
      this.fcmToken = null;
      await AsyncStorage.removeItem(FCM_TOKEN_KEY);
      console.log('FCM Token deleted');
    } catch (error) {
      console.error('Error deleting FCM token:', error);
    }
  }

  /**
   * Setup notification handlers
   */
  private setupNotificationHandlers(): void {
    // Handle foreground messages
    messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground message received:', remoteMessage);
      
      // You can show a custom notification here or update app state
      // For example, using a toast or modal
    });

    // Handle background/quit state messages
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Background message received:', remoteMessage);
      
      // Handle the message in background
    });

    // Handle notification opened app
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification opened app:', remoteMessage);
      
      // Navigate to specific screen based on notification data
      this.handleNotificationNavigation(remoteMessage);
    });

    // Check if app was opened by notification (quit state)
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('App opened by notification (quit state):', remoteMessage);
          this.handleNotificationNavigation(remoteMessage);
        }
      });
  }

  /**
   * Handle notification navigation
   * Update this based on your app's navigation structure
   */
  private handleNotificationNavigation(remoteMessage: any): void {
    // Example: Navigate based on notification data
    // const { screen, params } = remoteMessage.data;
    // navigation.navigate(screen, params);
    
    console.log('Handle navigation for:', remoteMessage.data);
  }

  /**
   * Get badge count (iOS only)
   */
  public async getBadgeCount(): Promise<number> {
    if (Platform.OS === 'ios') {
      try {
        const count = await messaging().getAPNSToken();
        return count ? 0 : 0; // Implement proper badge logic
      } catch (error) {
        console.error('Error getting badge count:', error);
        return 0;
      }
    }
    return 0;
  }

  /**
   * Set badge count (iOS only)
   */
  public async setBadgeCount(count: number): Promise<void> {
    if (Platform.OS === 'ios') {
      try {
        // Implement iOS badge count logic
        console.log('Set badge count:', count);
      } catch (error) {
        console.error('Error setting badge count:', error);
      }
    }
  }

  /**
   * Subscribe to topic
   */
  public async subscribeToTopic(topic: string): Promise<void> {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error(`Error subscribing to topic ${topic}:`, error);
    }
  }

  /**
   * Unsubscribe from topic
   */
  public async unsubscribeFromTopic(topic: string): Promise<void> {
    try {
      await messaging().unsubscribeFromTopic(topic);
      console.log(`Unsubscribed from topic: ${topic}`);
    } catch (error) {
      console.error(`Error unsubscribing from topic ${topic}:`, error);
    }
  }

  /**
   * Cleanup
   * Call this when needed (e.g., app unmount)
   */
  public cleanup(): void {
    if (this.unsubscribeTokenRefresh) {
      this.unsubscribeTokenRefresh();
      this.unsubscribeTokenRefresh = null;
    }
  }
}

// Export singleton instance
export default FirebaseMessagingService.getInstance();
