import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserAuth } from '@/types/auth';
import { StorageKey } from '@/constants/GeneralConstants';

interface AuthStore {
    loginAt: string | null;
    isUserLogin: boolean;
    setLoginAt: (loginAt: string | null) => void;
    setIsUserLogin: (isUserLogin: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
        loginAt: null,
        isUserLogin: false,
        setLoginAt: (loginAt) => set({ loginAt }),
        setIsUserLogin: (isUserLogin:boolean) => set({ isUserLogin }),
    }),
    {
      name: StorageKey.userInfo,
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
);
