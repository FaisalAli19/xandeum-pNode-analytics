export interface PNode {
  identity: string;
  status: "active" | "inactive" | "syncing";
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
  sortOrder: "asc" | "desc";
  filterStatus: FilterStatus;
  currentPage: number;
  itemsPerPage: number;
}

export type SortKey = keyof PNode;
export type FilterStatus = "all" | "active" | "inactive" | "syncing";
export type SortOrder = "asc" | "desc";
