import { useState, useEffect } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

const useBluetoothPermission = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const requestBluetoothPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        // For Android 12+ (API level 31+), need BLUETOOTH_SCAN and BLUETOOTH_CONNECT
        if (Platform.Version >= 31) {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          ]);

          const allGranted =
            granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED;

          setHasPermission(allGranted);
          return allGranted;
        } else {
          // For older Android versions, Bluetooth permissions are granted at install time
          setHasPermission(true);
          return true;
        }
      } else {
        // iOS Bluetooth permissions are handled automatically when you try to use Bluetooth
        setHasPermission(true);
        return true;
      }
    } catch (error) {
      console.error('Error requesting Bluetooth permission:', error);
      Alert.alert('Permission Error', 'Failed to request Bluetooth permission');
      setHasPermission(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkBluetoothPermission = async () => {
    try {
      if (Platform.OS === 'android' && Platform.Version >= 31) {
        const scanGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
        );
        const connectGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
        );

        const granted = scanGranted && connectGranted;
        setHasPermission(granted);
        return granted;
      } else {
        // For iOS and older Android versions
        setHasPermission(true);
        return true;
      }
    } catch (error) {
      console.error('Error checking Bluetooth permission:', error);
      setHasPermission(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkBluetoothPermission();
  }, []);

  return {
    hasPermission,
    isLoading,
    requestPermission: requestBluetoothPermission,
    checkPermission: checkBluetoothPermission,
  };
};

export default useBluetoothPermission;
