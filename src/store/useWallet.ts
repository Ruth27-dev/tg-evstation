import { create } from 'zustand';
import { UserBalance } from '@/types/wallet';

interface WalletStore {
    userWalletBalance: UserBalance | null;
    setUserWalletBalance: (userWalletBalance: UserBalance | null) => void;
}

export const useWalletStore = create<WalletStore>()((set) => ({
    userWalletBalance: null,
    setUserWalletBalance: (userWalletBalance) => set({ userWalletBalance }),
}));
