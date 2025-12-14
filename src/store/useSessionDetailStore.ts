import { create } from 'zustand';
import { SessionDetail } from '@/types';

interface SessionDetailStore {
    sessionDetail: SessionDetail | null;
    setSessionDetail: (data: any) => void;
    clearSessionDetail: () => void;
}

export const useSessionDetailStore = create<SessionDetailStore>()(
    (set) => ({
        sessionDetail: null,
        setSessionDetail: (sessionDetail: any) => set({ sessionDetail }),
        clearSessionDetail: () => set({ sessionDetail: null }),
    })
);
