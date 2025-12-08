import type { PNode, FilterStatus, SortKey, SortOrder } from '../types';

export const applyFilters = (
  pNodes: PNode[],
  {
    filterStatus,
    searchQuery,
    sortBy,
    sortOrder,
  }: {
    filterStatus: FilterStatus;
    searchQuery: string;
    sortBy: SortKey;
    sortOrder: SortOrder;
  }
): PNode[] => {
  let filtered = pNodes;

  if (filterStatus !== 'all') {
    filtered = filtered.filter((p) => p.status === filterStatus);
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) => p.identity.toLowerCase().includes(query) || p.peerId.toLowerCase().includes(query)
    );
  }

  filtered.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    const comparison =
      typeof aVal === 'string'
        ? aVal.toLowerCase().localeCompare(String(bVal).toLowerCase())
        : aVal > bVal
        ? 1
        : aVal < bVal
        ? -1
        : 0;
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return filtered;
};
