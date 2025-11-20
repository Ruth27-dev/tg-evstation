import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKey } from '@/constants/GeneralConstants';

interface PrinterStore {
    printerName: string | null;
    setPrinterName: (printerName: string | null) => void;
}

export const usePrinterStore = create<PrinterStore>()(
  persist(
    (set) => ({
        printerName: null,
        setPrinterName: (printerName) => set({ printerName }),
    }),
    {
      name: StorageKey.printer,
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
);
