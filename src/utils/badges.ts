import type { PNode } from "../types";

export const getStatusBadge = (
  status: PNode["status"]
): "success" | "warning" | "error" | "info" => {
  const badges: Record<
    PNode["status"],
    "success" | "warning" | "error" | "info"
  > = {
    active: "success",
    inactive: "error",
    syncing: "warning",
  };
  return badges[status] || "info";
};

export const getUptimeBadge = (
  uptime: number
): "success" | "warning" | "error" => {
  if (uptime >= 98) return "success";
  if (uptime >= 95) return "warning";
  return "error";
};

export const getReputationBadge = (
  reputation: number
): "success" | "warning" | "error" => {
  // Reputation is 0-10 scale, so adjust thresholds accordingly
  if (reputation >= 8) return "success"; // 8-10 is excellent
  if (reputation >= 5) return "warning"; // 5-7.9 is good
  return "error"; // 0-4.9 is poor
};

export const getPerformanceBadge = (
  performance: number
): "success" | "warning" | "error" => {
  if (performance >= 90) return "success";
  if (performance >= 75) return "warning";
  return "error";
};

export const getBadgeColor = (
  badgeType: "success" | "warning" | "error" | "info",
  isDarkMode: boolean = false
): string => {
  if (badgeType === "success") {
    // Darker green background in light mode for better text readability
    return isDarkMode ? "rgba(34, 197, 94, 0.15)" : "rgba(17, 223, 92, 0.3)";
  }
  if (badgeType === "warning") return "rgba(230, 129, 97, 0.15)";
  if (badgeType === "error") return "rgba(255, 84, 89, 0.15)";
  return "rgba(119, 124, 124, 0.15)";
};

export const getBadgeBorderColor = (
  badgeType: "success" | "warning" | "error" | "info"
): string => {
  if (badgeType === "success") return "var(--chakra-colors-green-500)";
  if (badgeType === "warning") return "var(--chakra-colors-orange-500)";
  if (badgeType === "error") return "var(--chakra-colors-red-500)";
  return "var(--chakra-colors-gray-400)";
};

export const getBadgeTextColor = (
  badgeType: "success" | "warning" | "error" | "info",
  isDarkMode: boolean = false
): string => {
  if (badgeType === "success")
    return isDarkMode
      ? "var(--chakra-colors-green-500)"
      : "var(--chakra-colors-green-900)";
  // Warning badges: red in light mode, white in dark mode
  if (badgeType === "warning")
    return isDarkMode ? "white" : "var(--chakra-colors-red-500)";
  // Error badges: red in light mode, white in dark mode
  if (badgeType === "error")
    return isDarkMode ? "white" : "var(--chakra-colors-red-500)";
  return "var(--chakra-colors-gray-400)";
};
