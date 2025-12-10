import { useQuery } from '@tanstack/react-query';
import { fetchProgramAccounts } from '../services/pnodesApiService';
import { decodePNodeAccounts } from '../services/pnodeDecoder';
import { transformPNodes } from '../services/pnodeTransform';
import { usePnodesStore } from '../store/usePnodesStore';
import type { PNode } from '../types';

interface UseFetchPnodesOptions {
  refetchInterval?: number;
  enabled?: boolean;
}

/**
 * React Query hook to fetch, decode, and transform pNodes
 * Automatically syncs data to Zustand store
 * Polls every 60 seconds by default
 */
export const useFetchPnodes = (options: UseFetchPnodesOptions = {}) => {
  const { refetchInterval = 60000, enabled = true } = options;
  const { setPnodes, setLoading, setError, setLastUpdate } = usePnodesStore();

  const query = useQuery<PNode[]>({
    queryKey: ['pnodes'],
    queryFn: async () => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Fetch program accounts from RPC
        const accounts = await fetchProgramAccounts();

        if (accounts.length === 0) {
          console.warn('⚠️ No pNode accounts found');
          setPnodes([]);
          setLastUpdate(new Date());
          setLoading(false);
          return [];
        }

        // Step 2: Decode base64 data
        const decodedData = decodePNodeAccounts(accounts);

        if (decodedData.length === 0) {
          console.warn('⚠️ No pNodes could be decoded');
          setPnodes([]);
          setLastUpdate(new Date());
          setLoading(false);
          return [];
        }

        // Step 3: Transform to dashboard format
        const transformed = transformPNodes(decodedData, accounts);

        // Step 4: Sync to Zustand store
        setPnodes(transformed);
        setLastUpdate(new Date());
        setLoading(false);

        console.log('✅ Zustand store updated with fresh data');
        return transformed;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch pNodes';
        console.error('❌ Error in useFetchPnodes:', errorMessage);
        setError(errorMessage);
        setLoading(false);
        throw error;
      }
    },
    refetchInterval, // Poll every 60 seconds (60000ms)
    enabled,
    retry: 3, // Retry 3 times on failure
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  return query;
};
