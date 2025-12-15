import type { PNode } from "../types";

interface PodWithStats {
  address?: string;
  is_public?: boolean;
  last_seen_timestamp: number;
  pubkey?: string;
  version?: string;
  rpc_port?: number;
  storage_committed?: number;
  storage_usage_percent?: number;
  storage_used?: number;
  uptime?: number;
}

/**
 * Calculate node status based on last seen timestamp
 * Returns 'active' if seen within last 5 minutes, otherwise 'inactive'
 */
function calculateStatus(lastSeenTimestamp: number): "active" | "inactive" {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const timeSinceLastSeen = now - lastSeenTimestamp;
  const minutesSinceLastSeen = timeSinceLastSeen / 60;

  // Active if seen within last 5 minutes, otherwise inactive
  return minutesSinceLastSeen < 5 ? "active" : "inactive";
}

/**
 * Calculate uptime percentage
 * Assuming uptime is in seconds, we'll calculate it as a percentage
 * For now, we'll use a simple calculation based on uptime duration
 */
function calculateUptimePercentage(uptimeSeconds: number): number {
  // If uptime is 0, return 0
  if (!uptimeSeconds || uptimeSeconds === 0) {
    return 0;
  }

  // Calculate uptime as percentage of a day (86400 seconds)
  // This gives us a sense of how long the node has been up
  const oneDay = 86400;
  const uptimeDays = uptimeSeconds / oneDay;

  // Cap at 100% and return as percentage
  // If uptime > 1 day, we consider it 100%
  return Math.min(100, (uptimeDays / 1) * 100);
}

/**
 * Calculate performance score (0-100) based on multiple factors
 *
 * PERFORMANCE CALCULATION EXPLANATION:
 * The performance score is an average of multiple factors, each contributing to the overall score:
 *
 * 1. Storage Usage Score (0-100):
 *    - Optimal storage usage is around 50%
 *    - Score decreases as usage deviates from 50% (too low or too high is bad)
 *    - Formula: 100 - |usage_percent - 50| * 2
 *    - Example: 50% usage = 100 points, 30% usage = 60 points, 80% usage = 40 points
 *
 * 2. Uptime Score (0-100):
 *    - Based on how long the node has been running
 *    - Normalized to 1 day (86400 seconds)
 *    - Formula: min(100, (uptime_seconds / 86400) * 100)
 *    - Example: 1 day uptime = 100 points, 12 hours = 50 points
 *
 * 3. Recency Score (0-100):
 *    - Based on how recently the node was last seen
 *    - Loses 2 points per minute since last seen
 *    - Formula: max(0, 100 - (minutes_since_last_seen * 2))
 *    - Example: Seen 1 min ago = 98 points, 30 min ago = 40 points, 50+ min ago = 0 points
 *
 * 4. Public Status Bonus (+10 points):
 *    - Public nodes get a 10-point bonus
 *
 * Final Score = (Storage Score + Uptime Score + Recency Score + Public Bonus) / Number of Factors
 */
function calculatePerformance(pod: PodWithStats): number {
  let score = 0;
  let factors = 0;

  // Factor 1: Storage usage (optimal around 50%)
  if (pod.storage_usage_percent !== undefined) {
    // Optimal storage usage is around 50%
    const storageScore =
      pod.storage_usage_percent > 0 && pod.storage_usage_percent < 100
        ? 100 - Math.abs(pod.storage_usage_percent - 50) * 2
        : 0;
    score += Math.max(0, storageScore);
    factors++;
  }

  // Factor 2: Uptime (longer is better)
  if (pod.uptime && pod.uptime > 0) {
    const uptimeScore = Math.min(100, (pod.uptime / 86400) * 100); // Normalize to 1 day
    score += uptimeScore;
    factors++;
  }

  // Factor 3: Recency (recent activity is good)
  const now = Math.floor(Date.now() / 1000);
  const timeSinceLastSeen = now - pod.last_seen_timestamp;
  const recencyScore = Math.max(0, 100 - (timeSinceLastSeen / 60) * 2); // Lose 2 points per minute
  score += Math.min(100, recencyScore);
  factors++;

  // Factor 4: Public status (public nodes are generally better)
  if (pod.is_public) {
    score += 100;
    factors++;
  }

  return factors > 0 ? score / factors : 0;
}

/**
 * Calculate reputation score (0-10) based on multiple factors
 *
 * REPUTATION (RANKING) CALCULATION EXPLANATION:
 * The reputation score is a cumulative score (not averaged) with a maximum of 10 points:
 *
 * 1. Uptime Points (0-10 points):
 *    - Based on how many days the node has been running
 *    - Formula: min(10, uptime_days * 0.1)
 *    - Example: 100 days = 10 points, 50 days = 5 points, 10 days = 1 point
 *
 * 2. Storage Commitment Points (0-5 points):
 *    - Based on how much storage the node has committed
 *    - Formula: min(5, storage_GB / 20)
 *    - Example: 100GB+ = 5 points, 60GB = 3 points, 20GB = 1 point
 *
 * 3. Recency Points (0-5 points):
 *    - Based on how recently the node was last seen
 *    - Loses 0.5 points per hour since last seen
 *    - Formula: max(0, 5 - (hours_since_last_seen * 0.5))
 *    - Example: Seen 1 hour ago = 4.5 points, 10 hours ago = 0 points
 *
 * 4. Public Status Bonus (+2 points):
 *    - Public nodes get a 2-point bonus
 *
 * 5. Version Bonus (+1 point):
 *    - Nodes with a version string get 1 point
 *
 * Final Score = Sum of all points (capped at 10)
 * Higher reputation = more reliable and trustworthy node
 */
function calculateReputation(pod: PodWithStats): number {
  let score = 0;

  // Factor 1: Uptime (longer uptime = higher reputation)
  if (pod.uptime && pod.uptime > 0) {
    const uptimeDays = pod.uptime / 86400;
    const uptimeScore = Math.min(10, uptimeDays * 0.1); // Max 10 points for 100 days
    score += uptimeScore;
  }

  // Factor 2: Storage commitment (more storage = higher reputation)
  if (pod.storage_committed) {
    const storageGB = pod.storage_committed / (1024 * 1024 * 1024);
    const storageScore = Math.min(5, storageGB / 20); // Max 5 points for 100GB+
    score += storageScore;
  }

  // Factor 3: Recency (recent activity = higher reputation)
  const now = Math.floor(Date.now() / 1000);
  const timeSinceLastSeen = now - pod.last_seen_timestamp;
  const hoursSinceLastSeen = timeSinceLastSeen / 3600;
  const recencyScore = Math.max(0, 5 - hoursSinceLastSeen * 0.5); // Lose 0.5 points per hour
  score += recencyScore;

  // Factor 4: Public status
  if (pod.is_public) {
    score += 2;
  }

  // Factor 5: Version (newer versions might be better, but we'll give base points)
  if (pod.version) {
    score += 1;
  }

  return Math.min(10, score);
}

/**
 * Transform API pod data to PNode format
 */
export function transformPodToPNode(pod: PodWithStats): PNode {
  const lastSeenDate = new Date(pod.last_seen_timestamp * 1000);
  const storageCommitted = pod.storage_committed || 0;
  const storageUsed = pod.storage_used || 0;
  const storageCapGB = storageCommitted / (1024 * 1024 * 1024);
  const storageUsedGB = storageUsed / (1024 * 1024 * 1024);
  const uptimeSeconds = pod.uptime || 0;

  // Ensure pubkey exists (should be guaranteed by filter, but adding safety check)
  const pubkey = pod.pubkey || "unknown";
  if (pubkey === "unknown") {
    console.warn("Pod without pubkey encountered:", pod);
  }

  return {
    identity: pubkey, // Always use pubkey as identity (unique identifier)
    status: calculateStatus(pod.last_seen_timestamp),
    uptime: calculateUptimePercentage(uptimeSeconds),
    performance: calculatePerformance(pod),
    lastHeartbeat: lastSeenDate,
    storageUsed: Math.round(storageUsedGB * 10) / 10, // Round to 1 decimal place
    storageCap: Math.round(storageCapGB * 10) / 10, // Round to 1 decimal place
    slotsProduced: 0, // Not available in API
    slotsSkipped: 0, // Not available in API
    peerId: pod.address || pubkey, // Use address if available, fallback to pubkey
    version: pod.version || "unknown",
    reputation: calculateReputation(pod),
  };
}

/**
 * Transform array of pods to PNodes
 * Filters out pods without pubkeys and deduplicates by pubkey
 */
export function transformPodsToPNodes(pods: PodWithStats[]): PNode[] {
  // Filter out pods without pubkeys
  const podsWithPubkeys = pods.filter(
    (pod) => pod.pubkey && pod.pubkey.trim() !== ""
  );

  // Deduplicate by pubkey - keep the most recent one (highest last_seen_timestamp)
  const uniquePodsMap = new Map<string, PodWithStats>();

  for (const pod of podsWithPubkeys) {
    const pubkey = pod.pubkey!; // We know it exists due to filter above

    if (!uniquePodsMap.has(pubkey)) {
      uniquePodsMap.set(pubkey, pod);
    } else {
      // If duplicate, keep the one with the most recent timestamp
      const existing = uniquePodsMap.get(pubkey)!;
      if (pod.last_seen_timestamp > existing.last_seen_timestamp) {
        uniquePodsMap.set(pubkey, pod);
      }
    }
  }

  // Transform to PNodes
  return Array.from(uniquePodsMap.values()).map(transformPodToPNode);
}
