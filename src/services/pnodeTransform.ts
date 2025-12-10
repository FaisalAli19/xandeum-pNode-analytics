import BN from 'bn.js';
import type { PNode } from '../types';
import type { RawPNodeData } from './pnodeDecoder';
import type { ProgramAccount } from './pnodesApiService';

/**
 * Maps status number to status string
 */
const mapStatus = (status: number): 'active' | 'syncing' | 'inactive' => {
  switch (status) {
    case 1:
      return 'active';
    case 2:
      return 'syncing';
    default:
      return 'inactive';
  }
};

/**
 * Converts bytes to GB
 */
const bytesToGB = (bytes: number | BN): number => {
  const bytesNum = BN.isBN(bytes) ? bytes.toNumber() : bytes;
  return bytesNum / (1024 * 1024 * 1024);
};

/**
 * Converts BN to number safely
 */
const bnToNumber = (value: number | BN | undefined): number => {
  if (!value) return 0;
  return BN.isBN(value) ? value.toNumber() : value;
};

/**
 * Transforms raw decoded pNode data to dashboard PNode format
 */
export const transformPNode = (rawData: RawPNodeData, account: ProgramAccount): PNode => {
  return {
    identity: rawData.identity || `pNode-${account.pubkey.slice(0, 8)}`,
    status: mapStatus(rawData.status || 0),
    uptime: rawData.uptime || 0,
    performance: rawData.performance || 0,
    lastHeartbeat: rawData.lastHeartbeat
      ? new Date(bnToNumber(rawData.lastHeartbeat) * 1000) // Convert Unix timestamp to Date
      : new Date(),
    storageUsed: bytesToGB(rawData.storageUsed || new BN(0)),
    storageCap: bytesToGB(rawData.storageCap || new BN(0)),
    slotsProduced: bnToNumber(rawData.slotsProduced),
    slotsSkipped: bnToNumber(rawData.slotsSkipped),
    peerId: rawData.peerId || account.pubkey,
    version: rawData.version || 'unknown',
    reputation: rawData.reputation || 0,
  };
};

/**
 * Transforms all decoded pNodes
 */
export const transformPNodes = (rawData: RawPNodeData[], accounts: ProgramAccount[]): PNode[] => {
  return rawData.map((data, index) => {
    const account = accounts[index];
    return transformPNode(data, account);
  });
};
