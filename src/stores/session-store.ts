import { create } from 'zustand';

interface SessionState {
  tableId: string | null;
  sessionId: string | null;
  setTable: (tableId: string) => void;
  setSession: (sessionId: string) => void;
  clear: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  tableId: null,
  sessionId: null,
  setTable: (tableId) => set({ tableId }),
  setSession: (sessionId) => set({ sessionId }),
  clear: () => set({ tableId: null, sessionId: null }),
}));
