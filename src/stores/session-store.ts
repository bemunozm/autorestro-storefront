import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionState {
  tableId: string | null;
  sessionId: string | null;
  setTable: (tableId: string) => void;
  setSession: (sessionId: string) => void;
  clear: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      tableId: null,
      sessionId: null,
      setTable: (tableId) => set({ tableId }),
      setSession: (sessionId) => set({ sessionId }),
      clear: () => set({ tableId: null, sessionId: null }),
    }),
    { name: 'autorestro-session' }
  )
);
