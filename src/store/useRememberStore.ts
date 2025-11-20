import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RememberStore {
  rememberMe: {
    username?: string;
    password?: string;
    remember: boolean
  }
  setRememberMe: (rememberMe: RememberStore['rememberMe']) => void;
}

export const useRememberStore = create<RememberStore>()(
  persist(
    (set) => ({
      rememberMe: { username: '', password: '', remember: false },
      setRememberMe: (rememberMe) => set({ rememberMe }),
    }),
    {
      name: 'remember-storage', // storage key
      storage: createJSONStorage(() => AsyncStorage), // use AsyncStorage
    }
  )
);
