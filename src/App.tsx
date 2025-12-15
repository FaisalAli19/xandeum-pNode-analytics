import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { pNodeStore } from "./store/pNodeStore";
import { useFetchPods } from "./hooks/useFetchPods";
import { applyFilters } from "./utils/filters";
import type { PNodeStoreState, SortKey, FilterStatus } from "./types";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { FilterTabs } from "./components/FilterTabs";
import { PNodeTable } from "./components/PNodeTable";
import { PNodeModal } from "./components/PNodeModal";
import { Pagination } from "./components/Pagination";
import { SkeletonLoader } from "./components/SkeletonLoader";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/toaster";
import { AnalyticsCharts } from "./components/AnalyticsCharts";

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

  // Fetch pods data (polls every 60s)
  // Note: The IP is configured in vite.config.ts proxy settings
  const {
    isLoading,
    error: fetchError,
    refetch,
  } = useFetchPods({
    refetchInterval: 0, // Disable auto-refetch, driven by UI timer
    enabled: true,
  });

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = pNodeStore.subscribe(setState);
    return unsubscribe;
  }, []);

  // Timer countdown effect (syncs with 60s polling)
  useEffect(() => {
    // Don't countdown if loading
    if (isLoading || state.loading) return;

    const timer = setInterval(() => {
      setTimeUntilRefresh((prev) => {
        if (prev <= 0) {
          // Trigger refresh when timer hits 0 (and isn't already loading)
          if (!isLoading && !state.loading) {
            refetch();
          }
          return 0; // Stay at 0 until data fetch completes and resets this
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, state.loading]);

  // Reset timer when data is fetched
  useEffect(() => {
    if (state.lastUpdated) {
      // Use setTimeout to avoid calling setState synchronously in effect
      setTimeout(() => {
        setTimeUntilRefresh(59);
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
      currentState.sortBy === key && currentState.sortOrder === "asc"
        ? "desc"
        : "asc";
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

  const handleSelectPNode = (pNode: PNodeStoreState["selectedPNode"]) => {
    if (!pNode) return;
    pNodeStore.setState({ selectedPNode: pNode });
    setShowModal(true);
  };

  const stats = {
    totalPNodes: state.pNodes.length,
    activePNodes: state.pNodes.filter((p) => p.status === "active").length,
    avgUptime:
      state.pNodes.length > 0
        ? (
            state.pNodes.reduce((sum, p) => sum + p.uptime, 0) /
            state.pNodes.length
          ).toFixed(2)
        : "0",
    avgPerformance:
      state.pNodes.length > 0
        ? (
            state.pNodes.reduce((sum, p) => sum + p.performance, 0) /
            state.pNodes.length
          ).toFixed(2)
        : "0",
  };

  const startIdx = (state.currentPage - 1) * state.itemsPerPage;
  const endIdx = startIdx + state.itemsPerPage;
  const paginatedPNodes = state.filteredPNodes.slice(startIdx, endIdx);
  const totalPages = Math.ceil(
    state.filteredPNodes.length / state.itemsPerPage
  );

  return (
    <Flex direction="column" minH="100vh">
      <Header />

      <Box
        as="main"
        flex="1"
        maxW="1400px"
        mx="auto"
        px="20"
        py="20"
        width="100%"
      >
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

        {/* Analytics Charts - Only show when we have data */}
        {state.pNodes.length > 0 && (
          <AnalyticsCharts
            pNodes={state.pNodes}
            stats={stats}
            timeUntilRefresh={timeUntilRefresh}
            onRefresh={handleRefresh}
            isRefreshing={state.loading || isLoading}
            loading={state.loading && state.pNodes.length === 0} // Only show skeleton on initial load or if no data
          />
        )}

        <SearchBar value={state.searchQuery} onChange={handleSearch} />

        <FilterTabs
          filterStatus={state.filterStatus}
          onFilterChange={handleFilterStatus}
          pNodes={state.pNodes}
        />

        {state.loading || isLoading ? (
          <Box>
            <Box
              mb="16"
              textAlign="center"
              color="fg.muted"
              fontSize="sm"
              minH="24px"
            >
              {state.pNodes.length === 0
                ? "⏳ Loading pNodes..."
                : "Refreshing data..."}
            </Box>
            <SkeletonLoader />
          </Box>
        ) : (
          state.pNodes.length > 0 && (
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
                onPageChange={(page) =>
                  pNodeStore.setState({ currentPage: page })
                }
              />
            </>
          )
        )}

        {!state.loading && state.pNodes.length === 0 && !state.error && (
          <Box textAlign="center" p="32" color="fg.muted">
            <Text fontSize="48px" mb="16">
              📭
            </Text>
            <Text>
              No pNodes found. Make sure the pRPC endpoint is running at
              http://127.0.0.1:6000/rpc
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
      <Footer />
    </Flex>
  );
}

export default App;
