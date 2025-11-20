import { create } from 'zustand';
import { UserAuth } from '@/types/auth';

interface MeStore {
    userData: UserAuth | null;
    setUserData: (userData: UserAuth | null) => void;
}

export const useMeStore = create<MeStore>()((set) => ({
    userData: null,
    setUserData: (userData) => set({ userData }),
}));
