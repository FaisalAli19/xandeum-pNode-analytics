export interface PNode {
  identity: string;
  status: 'active' | 'syncing' | 'inactive';
  uptime: number;
  performance: number;
  lastHeartbeat: Date | string;
  storageUsed: number;
  storageCap: number;
  slotsProduced: number;
  slotsSkipped: number;
  peerId: string;
  version: string;
  reputation: number;
}

export interface PNodeStoreState {
  pNodes: PNode[];
  filteredPNodes: PNode[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  selectedPNode: PNode | null;
  searchQuery: string;
  sortBy: keyof PNode;
  sortOrder: 'asc' | 'desc';
  filterStatus: 'all' | 'active' | 'syncing' | 'inactive';
  currentPage: number;
  itemsPerPage: number;
}

export type SortKey = keyof PNode;
export type FilterStatus = 'all' | 'active' | 'syncing' | 'inactive';
export type SortOrder = 'asc' | 'desc';
