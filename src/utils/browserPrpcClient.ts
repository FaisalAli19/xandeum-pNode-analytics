// Browser-compatible PrpcClient that uses Vite proxy to avoid ERR_UNSAFE_PORT
// This wraps the PrpcClient but uses a proxy path instead of direct IP:6000

interface Pod {
  address?: string;
  last_seen_timestamp: number;
  pubkey?: string;
  version?: string;
}

interface PodsResponse {
  pods: Pod[];
  total_count: number;
}

interface NodeStats {
  active_streams: number;
  cpu_percent: number;
  current_index: number;
  file_size: number;
  last_updated: number;
  packets_received: number;
  packets_sent: number;
  ram_total: number;
  ram_used: number;
  total_bytes: number;
  total_pages: number;
  uptime: number;
}

class PrpcError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PrpcError';
  }
}

/**
 * Browser-compatible PrpcClient that uses Vite proxy
 * to avoid ERR_UNSAFE_PORT error with port 6000
 */
export class BrowserPrpcClient {
  private baseUrl: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_ip: string) {
    // Use proxy path instead of direct IP:6000
    // The Vite proxy will forward /api/rpc to http://{ip}:6000/rpc
    this.baseUrl = '/api/rpc';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async call(method: string): Promise<any> {
    const request = {
      jsonrpc: '2.0',
      method,
      id: 1,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new PrpcError(`HTTP error: ${response.status}`);
      }

      const rpcResponse = await response.json();

      if (rpcResponse.error) {
        throw new PrpcError(rpcResponse.error.message);
      }

      if (!rpcResponse.result) {
        throw new PrpcError('No result in response');
      }

      return rpcResponse.result;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new PrpcError('Request timed out');
      }
      throw error;
    }
  }

  async getPods(): Promise<PodsResponse> {
    return this.call('get-pods-with-stats');
  }

  async getStats(): Promise<NodeStats> {
    return this.call('get-stats');
  }
}
