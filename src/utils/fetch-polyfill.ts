// Polyfill for node-fetch in browser environment
// This replaces node-fetch with the native browser fetch API
// The browser's native fetch is compatible with node-fetch v3's API
export default fetch;
