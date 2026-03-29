import { useSessionStore } from '@/stores/session-store';

export function useDineInMode() {
  const { sessionId, tableId } = useSessionStore();
  const isDineIn = !!sessionId && !!tableId;
  return { isDineIn, sessionId, tableId };
}
