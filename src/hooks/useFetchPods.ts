import { useEffect, useState } from 'react';
import { BrowserPrpcClient } from '../utils/browserPrpcClient';
import { transformPodsToPNodes } from '../utils/podTransform';
import { pNodeStore } from '../store/pNodeStore';
import { applyFilters } from '../utils/filters';
// import type { PNode } from '../types';

interface UseFetchPodsOptions {
  refetchInterval?: number;
  enabled?: boolean;
}

/**
 * Hook to fetch pods data from the API
 * Automatically refetches every 60 seconds
 * Updates the pNodeStore with transformed data
 * Note: The IP is configured in vite.config.ts proxy settings
 */
export const useFetchPods = (options: UseFetchPodsOptions = {}) => {
  const { refetchInterval = 60000, enabled = true } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // IP is configured in vite.config.ts proxy, so we can use any value here
  const client = new BrowserPrpcClient('proxy');

  const fetchPods = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Set loading state in store
      pNodeStore.setState({ loading: true });

      // Fetch pods with stats
      const response = await client.getPods();

      if (!response || !response.pods || !Array.isArray(response.pods)) {
        throw new Error('Invalid response format: pods array not found');
      }

      // Transform API response to PNode format
      const pNodes = transformPodsToPNodes(response.pods);

      // Get current store state for filters
      const currentState = pNodeStore.getState();

      // Apply filters to the new data
      const filteredPNodes = applyFilters(pNodes, {
        filterStatus: currentState.filterStatus,
        searchQuery: currentState.searchQuery,
        sortBy: currentState.sortBy,
        sortOrder: currentState.sortOrder,
      });

      // Update store with new data
      pNodeStore.setState({
        pNodes,
        filteredPNodes,
        loading: false,
        lastUpdated: new Date(),
        error: null,
      });

      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pods';
      console.error('❌ Error fetching pods:', errorMessage);
      setError(errorMessage);
      setIsLoading(false);

      // Update store with error
      pNodeStore.setState({
        loading: false,
        error: errorMessage,
      });
    }
  };

  useEffect(() => {
    if (!enabled) return;

    // Fetch immediately
    fetchPods();

    // Set up interval for refetching
    const intervalId = setInterval(() => {
      fetchPods();
    }, refetchInterval);

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchInterval, enabled]);

  return {
    isLoading,
    error,
    refetch: fetchPods,
  };
};
