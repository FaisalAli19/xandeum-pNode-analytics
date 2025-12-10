import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    // Plugin to replace node-fetch with native fetch (handles both static and dynamic imports)
    {
      name: 'replace-node-fetch',
      enforce: 'pre', // Run before other plugins
      resolveId(id) {
        // Handle both 'node-fetch' and 'node:fetch' imports
        if (id === 'node-fetch' || id === 'node:fetch') {
          return '\0virtual:node-fetch';
        }
        // Handle node: protocol imports that might cause issues
        if (id.startsWith('node:')) {
          // Return null to let other plugins handle it, but we can add specific handlers if needed
          if (id === 'node:stream/web' || id === 'node:fs' || id === 'node:fs/promises') {
            // These should not be used in browser, return empty module
            return `\0virtual:${id}`;
          }
        }
        return null;
      },
      load(id) {
        if (id === '\0virtual:node-fetch') {
          // Return a module that exports the native fetch
          // The browser's native fetch is compatible with node-fetch's API
          return `export default fetch;`;
        }
        // Handle node: protocol virtual modules
        if (id.startsWith('\0virtual:node:')) {
          // Return empty module for Node.js-only APIs
          return `export {};`;
        }
        return null;
      },
    },
    nodePolyfills({
      // Exclude fs and other Node-only modules that cause issues
      exclude: ['fs'],
      // Include only what's needed
      include: ['path', 'url', 'buffer', 'process'],
      // Globals polyfills
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  resolve: {
    alias: {
      // Also handle static imports
      'node-fetch': path.resolve(__dirname, './src/utils/fetch-polyfill.ts'),
    },
  },
  optimizeDeps: {
    exclude: ['node-fetch'],
  },
  server: {
    proxy: {
      // Proxy requests to /api/rpc to the actual backend on port 6000
      '/api/rpc': {
        target: 'http://192.190.136.36:6000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('proxy error', err);
          });
        },
      },
    },
  },
});
