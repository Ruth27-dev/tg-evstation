import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKey } from '@/constants/GeneralConstants';

interface AuthStore {
    isUserLogin: boolean;
    setIsUserLogin: (isUserLogin: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
        isUserLogin: false,
        setIsUserLogin: (isUserLogin:boolean) => set({ isUserLogin }),
    }),
    {
      name: StorageKey.userInfo,
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
);
