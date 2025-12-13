import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKey } from '@/constants/GeneralConstants';

interface LanguageStore {
    appLanguage: string | null;
    setAppLanguage: (language: string | null) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
        appLanguage: null,
        setAppLanguage: (language: string | null) => set({ appLanguage: language }),
    }),
    {
      name: StorageKey.appLanguage,
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
);
