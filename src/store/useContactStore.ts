import { ContactResponse } from '@/types';
import { create } from 'zustand';

interface ContactStore {
    contactData: ContactResponse | null;
    setContactData: (data: ContactResponse | null) => void;
}

export const useContactStore = create<ContactStore>()((set) => ({
    contactData: null,
    setContactData: (contactData) => set({ contactData }),
}));
