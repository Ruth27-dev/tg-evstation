import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FirebaseMessagingService from './FirebaseMessagingService';
import * as Keychain from 'react-native-keychain';
import { generateKeyPairSync } from 'react-native-quick-crypto';

const DEVICE_REGISTERED_KEY = '@device_registered';
const DEVICE_ID_KEY = '@device_id';

interface DeviceRegistrationPayload {
  os_version: string;
  model_name: string;
  fcm_token: string;
  device_name: string;
  device_id: string;
  public_key: string;
}

interface DeviceRegistrationResponse {
  success: boolean;
  message?: string;
  data?: any;
}

class DeviceRegistrationService {
  private static instance: DeviceRegistrationService;
  private isRegistering: boolean = false;
  private apiBaseUrl: string = ''; // TODO: Set your API base URL

  private constructor() {}

  public static getInstance(): DeviceRegistrationService {
    if (!DeviceRegistrationService.instance) {
      DeviceRegistrationService.instance = new DeviceRegistrationService();
    }
    return DeviceRegistrationService.instance;
  }

  /**
   * Set API base URL
   */
  public setApiBaseUrl(url: string): void {
    this.apiBaseUrl = url;
  }

  /**
   * Register device on app start
   * Call this in App.tsx after Firebase is initialized
   */
  public async registerDevice(): Promise<DeviceRegistrationResponse> {
    console.log('Starting device registration process');
    if (this.isRegistering) {
      console.log('Device registration already in progress');
      return { success: false, message: 'Registration in progress' };
    }

    try {
      this.isRegistering = true;

      // Check if device is already registered
      const isRegistered = await this.isDeviceRegistered();
      if (isRegistered) {
        console.log('Device already registered');
        return { success: true, message: 'Device already registered' };
      }

      // Get device information
      const deviceInfo = await this.getDeviceInfo();
      
      if (!deviceInfo.fcm_token) {
        console.warn('FCM token not available yet, will retry later');
        return { success: false, message: 'FCM token not available' };
      }

      // Send registration request to backend
      const response = await this.sendRegistrationRequest(deviceInfo);

      if (response.success) {
        // Mark device as registered
        await this.markDeviceAsRegistered();
        console.log('Device registered successfully:', response);
      }

      return response;
    } catch (error: any) {
      console.error('Device registration error:', error);
      return {
        success: false,
        message: error.message || 'Failed to register device',
      };
    } finally {
      this.isRegistering = false;
    }
  }

  /**
   * Force re-register device (useful when token changes)
   */
  public async reregisterDevice(): Promise<DeviceRegistrationResponse> {
    try {
      // Clear registration status
      await AsyncStorage.removeItem(DEVICE_REGISTERED_KEY);
      
      // Register again
      return await this.registerDevice();
    } catch (error: any) {
      console.error('Device re-registration error:', error);
      return {
        success: false,
        message: error.message || 'Failed to re-register device',
      };
    }
  }

  /**
   * Get device information
   */
  private async getDeviceInfo(): Promise<DeviceRegistrationPayload> {
    try {
      // Get or create device ID
      let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
        if (!deviceId) {
          deviceId = await DeviceInfo.getUniqueId();
          await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
        }

        // Get FCM token
        const fcmToken = await FirebaseMessagingService.getFCMToken();

        // Get device information
        const [
          systemVersion,
          model,
          deviceName,
          brand,
        ] = await Promise.all([
          DeviceInfo.getSystemVersion(),
          DeviceInfo.getModel(),
          DeviceInfo.getDeviceName(),
          DeviceInfo.getBrand(),
        ]);

        // Generate OS version string
        const osVersion = Platform.OS === 'ios' 
          ? `iOS ${systemVersion}`
          : `Android ${systemVersion}`;

        // Generate model name
        const modelName = `${brand} ${model}`;

        // Generate public key (RSA key pair)
        const publicKey = await this.generatePublicKey();

        return {
          os_version: osVersion,
          model_name: modelName,
          fcm_token: fcmToken || '',
          device_name: deviceName,
          device_id: deviceId,
          public_key: publicKey,
        };
      } catch (error) {
        console.error('Error getting device info:', error);
        throw error;
      }
    }
    private async generatePublicKey(): Promise<string> {
    try {
      // Check if RSA keypair is already generated
      const existing = await AsyncStorage.getItem('@device_public_key');
      if (existing) {
        return existing; // Return saved public key
      }

      // Generate RSA 2048-bit keypair using quick-crypto
      const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    // Save private key securely in system Keychain
    await Keychain.setGenericPassword(
      'device_rsa',
      privateKey,
      {
        service: 'device_rsa_keypair',
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      }
    );

    // Save public key for registration
    await AsyncStorage.setItem('@device_public_key', publicKey);

    return publicKey;

  } catch (error) {
    console.error('RSA keypair generation failed:', error);
    throw error;
  }
}

  
  /**
   * Send registration request to backend
   */
  private async sendRegistrationRequest(deviceInfo: DeviceRegistrationPayload): Promise<DeviceRegistrationResponse> {
    try {
      const endpoint = `${this.apiBaseUrl}/api/v1/device/register`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceInfo),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        message: 'Device registered successfully',
        data,
      };
    } catch (error: any) {
      console.error('Registration request error:', error);
      throw error;
    }
  }

  /**
   * Check if device is already registered
   */
  private async isDeviceRegistered(): Promise<boolean> {
    try {
      const registered = await AsyncStorage.getItem(DEVICE_REGISTERED_KEY);
      return registered === 'true';
    } catch (error) {
      console.error('Error checking registration status:', error);
      return false;
    }
  }

  /**
   * Mark device as registered
   */
  private async markDeviceAsRegistered(): Promise<void> {
    try {
      await AsyncStorage.setItem(DEVICE_REGISTERED_KEY, 'true');
    } catch (error) {
      console.error('Error marking device as registered:', error);
    }
  }

  /**
   * Unregister device (call on logout or app uninstall)
   */
  public async unregisterDevice(): Promise<void> {
    try {
      const deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
      
      if (deviceId && this.apiBaseUrl) {
        // TODO: Call backend to unregister device
        const endpoint = `${this.apiBaseUrl}/api/v1/device/unregister`;
        
        await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ device_id: deviceId }),
        });
      }

      // Clear local registration
      await AsyncStorage.removeItem(DEVICE_REGISTERED_KEY);
      console.log('Device unregistered');
    } catch (error) {
      console.error('Error unregistering device:', error);
    }
  }

  /**
   * Get stored device ID
   */
  public async getDeviceId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(DEVICE_ID_KEY);
    } catch (error) {
      console.error('Error getting device ID:', error);
      return null;
    }
  }

  /**
   * Update FCM token (call when token refreshes)
   */
  public async updateFCMToken(newToken: string): Promise<void> {
    try {
      const deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
      
      if (deviceId && this.apiBaseUrl) {
        // TODO: Call backend to update token
        const endpoint = `${this.apiBaseUrl}/api/v1/device/update-token`;
        
        await fetch(endpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            device_id: deviceId,
            fcm_token: newToken,
          }),
        });

        console.log('FCM token updated successfully');
      }
    } catch (error) {
      console.error('Error updating FCM token:', error);
    }
  }
}

// Export singleton instance
export default DeviceRegistrationService.getInstance();
