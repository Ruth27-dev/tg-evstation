import { useCallback, useEffect } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
} from "react-native-permissions";
import Geolocation, { GeolocationError } from "@react-native-community/geolocation";
import useStoreLocation, { AppLocation, LocationPermissionState } from "@/store/useStoreLocation";

const DEFAULT_LOCATION: AppLocation = {
  latitude: 11.589005,
  longitude: 104.897786,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

// A location already in the store younger than this is considered reliable enough to reuse.
export const FRESH_LOCATION_TTL_MS = 30000;

// Phase 1: accept a recent cached fix so the map can paint immediately.
const QUICK_FIX_OPTIONS = { enableHighAccuracy: false, timeout: 5000, maximumAge: 15000 };
// Phase 2: refine with a real GPS fix.
const FRESH_FIX_OPTIONS = { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 };

type PositionFix = { latitude: number; longitude: number; accuracy?: number; timestamp: number };

const mapGeolocationError = (error: GeolocationError): string => {
  switch (error.code) {
    case 1:
      return "permission-denied";
    case 2:
      return "position-unavailable";
    case 3:
      return "timeout";
    default:
      return "unknown-error";
  }
};

const mapPermissionResult = (status: string): LocationPermissionState => {
  if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) return "granted";
  if (status === RESULTS.BLOCKED) return "blocked";
  if (status === RESULTS.UNAVAILABLE) return "unavailable";
  return "denied";
};

const locationPermission = Platform.select({
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  default: null,
});

const fetchPosition = (options: typeof QUICK_FIX_OPTIONS): Promise<PositionFix | null> =>
  new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        resolve({
          latitude: parseFloat(latitude.toFixed(6)),
          longitude: parseFloat(longitude.toFixed(6)),
          accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        useStoreLocation.getState().setLocationError(mapGeolocationError(error));
        resolve(null);
      },
      options
    );
  });

const applyFix = (fix: PositionFix) => {
  useStoreLocation.getState().getCurrentUserLocation({
    latitude: fix.latitude,
    longitude: fix.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
    accuracy: fix.accuracy,
    timestamp: fix.timestamp,
  });
  useStoreLocation.getState().setLocationError(null);
};

// Deduped so concurrent callers (multiple mounted screens reacting to the same
// app-resume event) share one in-flight check instead of each issuing their own
// request() — a second concurrent request() on Android can reject outright.
let inFlightPermissionCheck: Promise<boolean> | null = null;

const checkAndRequestPermission = (): Promise<boolean> => {
  if (inFlightPermissionCheck) return inFlightPermissionCheck;

  inFlightPermissionCheck = (async () => {
    try {
      if (!locationPermission) {
        useStoreLocation.getState().setLocationPermissionState("unavailable");
        return false;
      }
      let status = await check(locationPermission);
      if (status === RESULTS.DENIED) {
        status = await request(locationPermission);
      }
      const mapped = mapPermissionResult(status);
      useStoreLocation.getState().setLocationPermissionState(mapped);
      return mapped === "granted";
    } catch {
      useStoreLocation.getState().setLocationPermissionState("denied");
      return false;
    } finally {
      inFlightPermissionCheck = null;
    }
  })();

  return inFlightPermissionCheck;
};

// Quick low-accuracy/cached fix first for a fast paint, then refine with a real GPS read.
// Guarded by the shared store flag (not a per-component ref) so overlapping calls from
// multiple mounted screens (e.g. MapScreen + ListStationScreen both alive in the stack)
// collapse into a single in-flight GPS request instead of racing each other.
const fetchFreshLocation = async (): Promise<boolean> => {
  if (useStoreLocation.getState().isFetchingLocation) return false;
  useStoreLocation.getState().setFetchingLocation(true);
  try {
    const quick = await fetchPosition(QUICK_FIX_OPTIONS);
    if (quick) applyFix(quick);

    const fresh = await fetchPosition(FRESH_FIX_OPTIONS);
    if (fresh) {
      applyFix(fresh);
      return true;
    }
    return !!quick;
  } finally {
    useStoreLocation.getState().setFetchingLocation(false);
  }
};

// Central flow: check permission -> reuse a fresh cached fix if we have one -> otherwise fetch.
const ensureLocation = async (forceRefresh = false): Promise<void> => {
  const granted = await checkAndRequestPermission();
  if (!granted) {
    if (!useStoreLocation.getState().currentLocation) {
      useStoreLocation.getState().getCurrentUserLocation(DEFAULT_LOCATION);
    }
    return;
  }

  const existing = useStoreLocation.getState().currentLocation as AppLocation | null;
  const isReliable =
    !forceRefresh &&
    !!existing?.timestamp &&
    Date.now() - existing.timestamp < FRESH_LOCATION_TTL_MS;
  if (isReliable) return;

  const success = await fetchFreshLocation();
  if (!success && !useStoreLocation.getState().currentLocation) {
    useStoreLocation.getState().getCurrentUserLocation(DEFAULT_LOCATION);
  }
};

const useLocationPermission = () => {
  const {
    currentLocation,
    isFetchingLocation,
    locationPermissionState,
    locationError,
  } = useStoreLocation();

  useEffect(() => {
    ensureLocation(false);

    const subscription = AppState.addEventListener("change", (nextState: AppStateStatus) => {
      if (nextState === "active") {
        ensureLocation(false);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    permissionStatus: locationPermissionState,
    locationError,
    isFetchingLocation,
    currentLocation,
    getCurrentLocation: useCallback(() => ensureLocation(false), []),
    refreshLocation: useCallback(() => ensureLocation(true), []),
    requestPermission: checkAndRequestPermission,
  };
};

export default useLocationPermission;
