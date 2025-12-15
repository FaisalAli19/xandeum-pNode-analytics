import { Box, Button, SimpleGrid, Text, Skeleton } from "@chakra-ui/react";
import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import type { PNode } from "../types";

interface AnalyticsChartsProps {
  pNodes: PNode[];
  timeUntilRefresh: number;
  onRefresh: () => void;
  isRefreshing: boolean;
  stats: {
    totalPNodes: number;
    activePNodes: number;
    avgUptime: string;
    avgPerformance: string;
  };
  loading?: boolean;
}

// Custom Tooltip for Charts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box
        bg="gray.800"
        p="3"
        border="1px solid"
        borderColor="gray.600"
        borderRadius="md"
        boxShadow="dark-lg"
        zIndex={99999}
      >
        <Text color="white" fontWeight="bold" mb="1">
          {payload[0].name}
        </Text>
        <Text color="white" fontSize="sm">
          {payload[0].value}
          {payload[0].name === "Next Refresh"
            ? "s"
            : payload[0].name === "nodes"
            ? ""
            : "%"}
        </Text>
      </Box>
    );
  }
  return null;
};

export function AnalyticsCharts({
  pNodes,
  timeUntilRefresh,
  onRefresh,
  isRefreshing,
  stats,
  loading = false,
}: AnalyticsChartsProps) {
  // 1. Network Status (Active vs Inactive)
  const statusData = useMemo(() => {
    const activeCount = pNodes.filter((n) => n.status === "active").length;
    const inactiveCount = pNodes.length - activeCount;

    return [
      { name: "Active", value: activeCount, color: "#38A169" }, // green.500
      { name: "Inactive", value: inactiveCount, color: "#E53E3E" }, // red.500
    ];
  }, [pNodes]);

  // 2. Average Metrics (Uptime & Performance)
  const avgData = useMemo(() => {
    return [
      {
        name: "Avg Uptime",
        value: parseFloat(stats.avgUptime),
        fill: "#319795", // teal.500
      },
      {
        name: "Avg Performance",
        value: parseFloat(stats.avgPerformance),
        fill: "#D53F8C", // pink.500
      },
    ];
  }, [stats]);

  // 3. Refresh Timer Gauge
  const timerData = useMemo(() => {
    return [
      { name: "Remaining", value: timeUntilRefresh, color: "#319795" }, // teal.500
      {
        name: "Elapsed",
        value: 60 - timeUntilRefresh,
        color: "rgba(255,255,255,0.1)",
      },
    ];
  }, [timeUntilRefresh]);

  return (
    <SimpleGrid columns={{ base: 1, md: 3, lg: 3 }} gap="8" mb="20">
      {/* 1. Network Status */}
      <Box
        bg="surface"
        border="1px solid"
        borderColor="card.border"
        borderRadius="xl"
        p="12"
        boxShadow="sm"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Text
          fontSize="xs"
          color="fg.muted"
          fontWeight="bold"
          mb="4"
          textTransform="uppercase"
          letterSpacing="wider"
          alignSelf="flex-start"
        >
          Network Status
        </Text>
        <Box h="220px" w="100%" position="relative">
          {loading ? (
            <Skeleton height="100%" width="100%" borderRadius="full" />
          ) : (
            <>
              {/* Box positioned absolute but with low z-index so tooltip covers it */}
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                textAlign="center"
                pointerEvents="none"
                zIndex={0}
              >
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color="white"
                  lineHeight="1"
                >
                  {pNodes.length}
                </Text>
                <Text fontSize="xs" color="gray.400">
                  Nodes
                </Text>
              </Box>
              <ResponsiveContainer
                width="100%"
                height="100%"
                style={{ zIndex: 1 }}
              >
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    isAnimationActive={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "transparent" }}
                    wrapperStyle={{ zIndex: 1000 }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconSize={8}
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </>
          )}
        </Box>
      </Box>

      {/* 2. Network Averages */}
      <Box
        bg="surface"
        border="1px solid"
        borderColor="card.border"
        borderRadius="xl"
        p="12"
        boxShadow="sm"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Text
          fontSize="xs"
          color="fg.muted"
          fontWeight="bold"
          mb="4"
          textTransform="uppercase"
          letterSpacing="wider"
          alignSelf="flex-start"
        >
          Network Averages
        </Text>
        <Box h="220px" w="100%" position="relative">
          {loading ? (
            <Skeleton height="100%" width="100%" borderRadius="full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="70%"
                innerRadius="40%"
                outerRadius="100%"
                barSize={24}
                data={avgData}
                startAngle={180}
                endAngle={0}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background={{ fill: "rgba(255,255,255,0.05)" }}
                  dataKey="value"
                  isAnimationActive={false}
                />
                <Legend
                  iconSize={8}
                  verticalAlign="bottom"
                  wrapperStyle={{ fontSize: "12px" }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "transparent" }}
                  wrapperStyle={{ zIndex: 1000 }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          )}
        </Box>
      </Box>

      {/* 3. Helper/Refresh Timer */}
      <Box
        bg="surface"
        border="1px solid"
        borderColor="card.border"
        borderRadius="xl"
        p="12"
        boxShadow="sm"
        display="flex"
        flexDirection="column"
        alignItems="center"
        position="relative"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          alignItems="center"
          mb="4"
        >
          <Text
            fontSize="xs"
            color="fg.muted"
            fontWeight="bold"
            textTransform="uppercase"
            letterSpacing="wider"
          >
            Next Refresh
          </Text>
          <Button
            variant="ghost"
            size="xs"
            onClick={onRefresh}
            opacity={isRefreshing ? 0.6 : 1}
            fontSize="14px"
            p="1"
            minW="auto"
            h="auto"
            color="primary"
            _hover={{ bg: "whiteAlpha.100" }}
          >
            🔄
          </Button>
        </Box>

        <Box h="220px" w="100%" position="relative">
          {loading ? (
            <Skeleton height="100%" width="100%" borderRadius="full" />
          ) : (
            <>
              {/* Timer Text - behind chart layer so tooltip works */}
              <Box
                position="absolute"
                top="65%"
                left="50%"
                transform="translate(-50%, -50%)"
                textAlign="center"
                pointerEvents="none"
                zIndex={0}
              >
                <Text
                  fontSize="3xl"
                  fontWeight="bold"
                  color="teal.300"
                  lineHeight="1"
                >
                  {timeUntilRefresh}s
                </Text>
                <Text fontSize="xs" color="gray.400" mt="1">
                  Until Update
                </Text>
              </Box>
              <ResponsiveContainer
                width="100%"
                height="100%"
                style={{ zIndex: 1 }}
              >
                <PieChart>
                  <Pie
                    data={timerData}
                    cx="50%"
                    cy="70%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={85}
                    dataKey="value"
                    stroke="none"
                    isAnimationActive={false}
                  >
                    {timerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </>
          )}
        </Box>
      </Box>
    </SimpleGrid>
  );
}
