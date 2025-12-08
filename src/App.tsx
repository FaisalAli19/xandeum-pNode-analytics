import { Box, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { pNodeStore } from './store/pNodeStore';
import { mockFetchPNodes } from './services/pNodeService';
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

  useEffect(() => {
    const unsubscribe = pNodeStore.subscribe(setState);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const currentState = pNodeStore.getState();
      pNodeStore.setState({ loading: true, error: null });
      try {
        const pNodes = await mockFetchPNodes();
        const filteredPNodes = applyFilters(pNodes, {
          filterStatus: currentState.filterStatus,
          searchQuery: currentState.searchQuery,
          sortBy: currentState.sortBy,
          sortOrder: currentState.sortOrder,
        });

        pNodeStore.setState({
          pNodes,
          filteredPNodes,
          loading: false,
          lastUpdated: new Date(),
          error: null,
        });
        setTimeUntilRefresh(59);
        setRefreshProgress(100);
      } catch (error) {
        pNodeStore.setState({
          error: error instanceof Error ? error.message : 'Failed to fetch pNodes',
          loading: false,
        });
      }
    };

    // Initial fetch only - countdown timer will handle subsequent refreshes
    fetchData();
  }, []);

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilRefresh((prev) => {
        if (prev === 0) {
          // When timer reaches 0s, trigger refresh and reset to 59
          const fetchData = async () => {
            const currentState = pNodeStore.getState();
            pNodeStore.setState({ loading: true, error: null });
            try {
              const pNodes = await mockFetchPNodes();
              const filteredPNodes = applyFilters(pNodes, {
                filterStatus: currentState.filterStatus,
                searchQuery: currentState.searchQuery,
                sortBy: currentState.sortBy,
                sortOrder: currentState.sortOrder,
              });

              pNodeStore.setState({
                pNodes,
                filteredPNodes,
                loading: false,
                lastUpdated: new Date(),
                error: null,
              });
            } catch (error) {
              pNodeStore.setState({
                error: error instanceof Error ? error.message : 'Failed to fetch pNodes',
                loading: false,
              });
            }
          };
          fetchData();
          setRefreshProgress(100); // Reset progress to 100% when starting new countdown
          return 59; // Start countdown from 59
        }
        const newVal = prev - 1;
        // Progress decreases as countdown decreases: 100% at 59s, 0% at 0s
        setRefreshProgress((newVal / 59) * 100);
        return newVal;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = (query: string) => {
    pNodeStore.setState({ searchQuery: query, currentPage: 1 });
    const filtered = applyFilters(state.pNodes, {
      filterStatus: state.filterStatus,
      searchQuery: query,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
    });
    pNodeStore.setState({ filteredPNodes: filtered });
  };

  const handleFilterStatus = (status: FilterStatus) => {
    pNodeStore.setState({ filterStatus: status, currentPage: 1 });
    const filtered = applyFilters(state.pNodes, {
      filterStatus: status,
      searchQuery: state.searchQuery,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
    });
    pNodeStore.setState({ filteredPNodes: filtered });
  };

  const handleSort = (key: SortKey) => {
    const newOrder = state.sortBy === key && state.sortOrder === 'asc' ? 'desc' : 'asc';
    pNodeStore.setState({ sortBy: key, sortOrder: newOrder, currentPage: 1 });
    const filtered = applyFilters(state.pNodes, {
      filterStatus: state.filterStatus,
      searchQuery: state.searchQuery,
      sortBy: key,
      sortOrder: newOrder,
    });
    pNodeStore.setState({ filteredPNodes: filtered });
  };

  const handleRefresh = () => {
    pNodeStore.setState({ loading: true });
    setTimeout(() => {
      const filtered = applyFilters(state.pNodes, {
        filterStatus: state.filterStatus,
        searchQuery: state.searchQuery,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      });
      pNodeStore.setState({ filteredPNodes: filtered, loading: false });
    }, 500);
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
        {state.error && (
          <Box
            bg="rgba(255, 84, 89, 0.1)"
            border="1px solid"
            borderColor="error"
            borderRadius="md"
            p="12"
            color="error"
            mb="16"
          >
            ❌ {state.error}
          </Box>
        )}

        <StatsCards
          stats={stats}
          timeUntilRefresh={timeUntilRefresh}
          refreshProgress={refreshProgress}
          onRefresh={handleRefresh}
          loading={state.loading}
        />

        <SearchBar value={state.searchQuery} onChange={handleSearch} />

        <FilterTabs
          filterStatus={state.filterStatus}
          onFilterChange={handleFilterStatus}
          pNodes={state.pNodes}
        />

        {state.loading && state.pNodes.length === 0 && (
          <Box>
            <Text textAlign="center" color="fg.muted" mb="16" fontSize="sm">
              ⏳ Loading pNodes...
            </Text>
            <SkeletonLoader />
          </Box>
        )}

        {state.loading && state.pNodes.length > 0 && (
          <Box opacity={0.6} pointerEvents="none">
            <SkeletonLoader />
          </Box>
        )}

        {!state.loading && state.pNodes.length > 0 && (
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
