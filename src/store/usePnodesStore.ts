import { create } from 'zustand';
import type { PNode } from '../types';

interface PnodesStoreState {
  pnodes: PNode[];
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  setPnodes: (pnodes: PNode[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLastUpdate: (date: Date) => void;
}

/**
 * Zustand store for pNodes data
 * This store syncs with React Query data
 */
export const usePnodesStore = create<PnodesStoreState>((set) => ({
  pnodes: [],
  isLoading: false,
  error: null,
  lastUpdate: null,
  setPnodes: (pnodes) => set({ pnodes }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setLastUpdate: (lastUpdate) => set({ lastUpdate }),
}));
