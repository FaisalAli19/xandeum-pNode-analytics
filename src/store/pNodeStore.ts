import type { PNodeStoreState } from '../types';

type Listener = (state: PNodeStoreState) => void;

class PNodeStore {
  private state: PNodeStoreState = {
    pNodes: [],
    filteredPNodes: [],
    loading: false,
    error: null,
    lastUpdated: null,
    selectedPNode: null,
    searchQuery: '',
    sortBy: 'identity',
    sortOrder: 'asc',
    filterStatus: 'all',
    currentPage: 1,
    itemsPerPage: 10,
  };

  private listeners: Listener[] = [];

  setState(updates: Partial<PNodeStoreState>): void {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach((fn) => fn(this.state));
  }

  subscribe(fn: Listener): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  getState(): PNodeStoreState {
    return this.state;
  }
}

export const pNodeStore = new PNodeStore();
