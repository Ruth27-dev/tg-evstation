import { useEffect, useState } from 'react';
import DeviceRegistrationService from '@/services/DeviceRegistrationService';

interface UseDeviceRegistration {
  isRegistered: boolean;
  isRegistering: boolean;
  error: string | null;
  deviceId: string | null;
  registerDevice: () => Promise<void>;
  reregisterDevice: () => Promise<void>;
  unregisterDevice: () => Promise<void>;
}

/**
 * Custom hook for device registration
 * 
 * Usage:
 * ```tsx
 * const { isRegistered, deviceId, registerDevice } = useDeviceRegistration();
 * 
 * console.log('Device ID:', deviceId);
 * console.log('Is Registered:', isRegistered);
 * ```
 */
export const useDeviceRegistration = (): UseDeviceRegistration => {
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    loadDeviceId();
  }, []);

  const loadDeviceId = async () => {
    try {
      const id = await DeviceRegistrationService.getDeviceId();
      setDeviceId(id);
    } catch (err: any) {
      console.error('Error loading device ID:', err);
    }
  };

  const registerDevice = async () => {
    try {
      setIsRegistering(true);
      setError(null);

      const response = await DeviceRegistrationService.registerDevice();
      
      if (response.success) {
        setIsRegistered(true);
        await loadDeviceId();
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err: any) {
      console.error('Error registering device:', err);
      setError(err.message || 'Failed to register device');
    } finally {
      setIsRegistering(false);
    }
  };

  const reregisterDevice = async () => {
    try {
      setIsRegistering(true);
      setError(null);

      const response = await DeviceRegistrationService.reregisterDevice();
      
      if (response.success) {
        setIsRegistered(true);
        await loadDeviceId();
      } else {
        setError(response.message || 'Re-registration failed');
      }
    } catch (err: any) {
      console.error('Error re-registering device:', err);
      setError(err.message || 'Failed to re-register device');
    } finally {
      setIsRegistering(false);
    }
  };

  const unregisterDevice = async () => {
    try {
      await DeviceRegistrationService.unregisterDevice();
      setIsRegistered(false);
    } catch (err: any) {
      console.error('Error unregistering device:', err);
      setError(err.message || 'Failed to unregister device');
    }
  };

  return {
    isRegistered,
    isRegistering,
    error,
    deviceId,
    registerDevice,
    reregisterDevice,
    unregisterDevice,
  };
};
