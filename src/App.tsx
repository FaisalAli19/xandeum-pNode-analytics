import { Box, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { pNodeStore } from './store/pNodeStore';
import { useFetchPods } from './hooks/useFetchPods';
import { applyFilters } from './utils/filters';
import type { PNodeStoreState, SortKey, FilterStatus } from './types';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { SearchBar } from './components/SearchBar';
import { FilterTabs } from './components/FilterTabs';
import { PNodeTable } from './components/PNodeTable';
import { PNodeModal } from './components/PNodeModal';
import { Pagination } from './components/Pagination';
import { SkeletonLoader } from './components/SkeletonLoader';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <Box minH="100vh" bg="bg">
      <Main />
    </Box>
  );
}

function Main() {
  const [state, setState] = useState<PNodeStoreState>(pNodeStore.getState());
  const [showModal, setShowModal] = useState(false);
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(59);
  const [refreshProgress, setRefreshProgress] = useState(100);

  // Fetch pods data (polls every 60s)
  // Note: The IP is configured in vite.config.ts proxy settings
  const {
    isLoading,
    error: fetchError,
    refetch,
  } = useFetchPods({
    refetchInterval: 60000,
    enabled: true,
  });

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = pNodeStore.subscribe(setState);
    return unsubscribe;
  }, []);

  // Timer countdown effect (syncs with 60s polling)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilRefresh((prev) => {
        if (prev === 0) {
          // Reset to 59 when data refetches
          setRefreshProgress(100);
          return 59;
        }
        const newVal = prev - 1;
        // Progress decreases as countdown decreases: 100% at 59s, 0% at 0s
        setRefreshProgress((newVal / 59) * 100);
        return newVal;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Reset timer when data is fetched
  useEffect(() => {
    if (state.lastUpdated) {
      // Use setTimeout to avoid calling setState synchronously in effect
      setTimeout(() => {
        setTimeUntilRefresh(59);
        setRefreshProgress(100);
      }, 0);
    }
  }, [state.lastUpdated]);

  const handleSearch = (query: string) => {
    const currentState = pNodeStore.getState();
    pNodeStore.setState({ searchQuery: query, currentPage: 1 });
    const filtered = applyFilters(currentState.pNodes, {
      filterStatus: currentState.filterStatus,
      searchQuery: query,
      sortBy: currentState.sortBy,
      sortOrder: currentState.sortOrder,
    });
    pNodeStore.setState({ filteredPNodes: filtered });
  };

  const handleFilterStatus = (status: FilterStatus) => {
    const currentState = pNodeStore.getState();
    pNodeStore.setState({ filterStatus: status, currentPage: 1 });
    const filtered = applyFilters(currentState.pNodes, {
      filterStatus: status,
      searchQuery: currentState.searchQuery,
      sortBy: currentState.sortBy,
      sortOrder: currentState.sortOrder,
    });
    pNodeStore.setState({ filteredPNodes: filtered });
  };

  const handleSort = (key: SortKey) => {
    const currentState = pNodeStore.getState();
    const newOrder =
      currentState.sortBy === key && currentState.sortOrder === 'asc' ? 'desc' : 'asc';
    pNodeStore.setState({ sortBy: key, sortOrder: newOrder, currentPage: 1 });
    const filtered = applyFilters(currentState.pNodes, {
      filterStatus: currentState.filterStatus,
      searchQuery: currentState.searchQuery,
      sortBy: key,
      sortOrder: newOrder,
    });
    pNodeStore.setState({ filteredPNodes: filtered });
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleSelectPNode = (pNode: PNodeStoreState['selectedPNode']) => {
    if (!pNode) return;
    pNodeStore.setState({ selectedPNode: pNode });
    setShowModal(true);
  };

  const stats = {
    totalPNodes: state.pNodes.length,
    activePNodes: state.pNodes.filter((p) => p.status === 'active').length,
    avgUptime:
      state.pNodes.length > 0
        ? (state.pNodes.reduce((sum, p) => sum + p.uptime, 0) / state.pNodes.length).toFixed(2)
        : '0',
    avgPerformance:
      state.pNodes.length > 0
        ? (state.pNodes.reduce((sum, p) => sum + p.performance, 0) / state.pNodes.length).toFixed(2)
        : '0',
  };

  const startIdx = (state.currentPage - 1) * state.itemsPerPage;
  const endIdx = startIdx + state.itemsPerPage;
  const paginatedPNodes = state.filteredPNodes.slice(startIdx, endIdx);
  const totalPages = Math.ceil(state.filteredPNodes.length / state.itemsPerPage);

  return (
    <Box>
      <Header activePNodes={stats.activePNodes} lastUpdated={state.lastUpdated} />

      <Box as="main" maxW="1400px" mx="auto" px="20" py="20">
        {(state.error || fetchError) && (
          <Box
            bg="rgba(255, 84, 89, 0.1)"
            border="1px solid"
            borderColor="error"
            borderRadius="md"
            p="12"
            color="error"
            mb="16"
          >
            ❌ {state.error || fetchError}
          </Box>
        )}

        <StatsCards
          stats={stats}
          timeUntilRefresh={timeUntilRefresh}
          refreshProgress={refreshProgress}
          onRefresh={handleRefresh}
          loading={state.loading || isLoading}
        />

        <SearchBar value={state.searchQuery} onChange={handleSearch} />

        <FilterTabs
          filterStatus={state.filterStatus}
          onFilterChange={handleFilterStatus}
          pNodes={state.pNodes}
        />

        {(state.loading || isLoading) && state.pNodes.length === 0 && (
          <Box>
            <Text textAlign="center" color="fg.muted" mb="16" fontSize="sm">
              ⏳ Loading pNodes...
            </Text>
            <SkeletonLoader />
          </Box>
        )}

        {(state.loading || isLoading) && state.pNodes.length > 0 && (
          <Box opacity={0.6} pointerEvents="none">
            <SkeletonLoader />
          </Box>
        )}

        {!state.loading && !isLoading && state.pNodes.length > 0 && (
          <>
            <PNodeTable
              pNodes={paginatedPNodes}
              sortBy={state.sortBy}
              sortOrder={state.sortOrder}
              onSort={handleSort}
              onView={handleSelectPNode}
            />

            <Pagination
              currentPage={state.currentPage}
              totalPages={totalPages}
              onPageChange={(page) => pNodeStore.setState({ currentPage: page })}
            />
          </>
        )}

        {!state.loading && state.pNodes.length === 0 && !state.error && (
          <Box textAlign="center" p="32" color="fg.muted">
            <Text fontSize="48px" mb="16">
              📭
            </Text>
            <Text>
              No pNodes found. Make sure the pRPC endpoint is running at http://127.0.0.1:6000/rpc
            </Text>
          </Box>
        )}
      </Box>

      <PNodeModal
        pNode={state.selectedPNode}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      <Toaster />
    </Box>
  );
}

export default App;
