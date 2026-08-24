import { create } from 'zustand';

export interface AppLocation {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
    accuracy?: number;
    timestamp?: number;
}

export type LocationPermissionState = 'unknown' | 'granted' | 'denied' | 'blocked' | 'unavailable';

const useStoreLocation: any = create((set) => ({
    currentLocation:null,
    isConnected:false,
    isFetchingLocation: false,
    locationPermissionState: 'unknown' as LocationPermissionState,
    locationError: null as string | null,
    getCurrentUserLocation: async (location:AppLocation) => {
        set({ currentLocation: location });
    },
    getInternetConnection: (status:boolean) =>{
        set({ isConnected: status });
    },
    setFetchingLocation: (isFetching: boolean) => {
        set({ isFetchingLocation: isFetching });
    },
    setLocationPermissionState: (state: LocationPermissionState) => {
        set({ locationPermissionState: state });
    },
    setLocationError: (error: string | null) => {
        set({ locationError: error });
    },
}));

export default useStoreLocation;
