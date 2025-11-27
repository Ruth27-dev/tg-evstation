import { create } from 'zustand';

interface AppLocation {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

const useStoreLocation: any = create((set) => ({
    currentLocation:null,
    isConnected:false,
    getCurrentUserLocation: async (location:AppLocation) => {
        set({ currentLocation: location });
    },
    getInternetConnection: (status:boolean) =>{
        set({ isConnected: status });
    }
}));

export default useStoreLocation;
