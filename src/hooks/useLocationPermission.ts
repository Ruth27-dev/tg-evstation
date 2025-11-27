import { useState, useEffect } from "react";
import { Platform } from "react-native";
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  PermissionStatus,
} from "react-native-permissions";
import Geolocation from "@react-native-community/geolocation";
import useStoreLocation from "@/store/useStoreLocation";

const DEFAULT_LOCATION = {
  latitude: 11.589005,
  longitude: 104.897786,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const useLocationPermission = () => {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus | null>(null);
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATION);
  const { getCurrentUserLocation } = useStoreLocation();

  const locationPermission = Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    default: null,
  });

  const checkAndRequestPermission = async (): Promise<boolean> => {
    try {
      if (!locationPermission) return false;

      let status = await check(locationPermission);
      if (status === RESULTS.DENIED || status === RESULTS.LIMITED || status === RESULTS.BLOCKED) {
        status = await request(locationPermission);
      }
      setPermissionStatus(status);
      return status === RESULTS.GRANTED;
    } catch (error) {
      return false;
    }
  };

  const safelySetLocation = (location: typeof DEFAULT_LOCATION) => {
    setCurrentLocation(location);
    getCurrentUserLocation(location);
  };

  const getCurrentLocation = async (): Promise<void> => {
    try {
      await new Promise<void>((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const location = {
              latitude: parseFloat(latitude.toFixed(6)),
              longitude: parseFloat(longitude.toFixed(6)),
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            };
            safelySetLocation(location);
            resolve();
          },
          (error) => {
            safelySetLocation(DEFAULT_LOCATION); // fallback
            resolve(); // resolve even on error to avoid crash
          },
          {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 1000,
          }
        );
      });
    } catch (error) {
      safelySetLocation(DEFAULT_LOCATION);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const hasPermission = await checkAndRequestPermission();
      if (!cancelled) {
        if (hasPermission) {
          await getCurrentLocation();
        } else {
          safelySetLocation(DEFAULT_LOCATION);
        }
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    permissionStatus,
    currentLocation,
    getCurrentLocation,
    requestPermission: checkAndRequestPermission,
  };
};

export default useLocationPermission;
