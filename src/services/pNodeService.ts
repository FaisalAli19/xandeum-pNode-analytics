import type { PNode } from '../types';
import mockPNodesData from '../data/mockPNodes.json';

export const mockFetchPNodes = async (): Promise<PNode[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pNodes: PNode[] = (mockPNodesData as PNode[]).map((node) => ({
        ...node,
        lastHeartbeat: new Date(Date.now() - Math.random() * 60000),
      }));
      resolve(pNodes);
    }, 1000);
  });
};
