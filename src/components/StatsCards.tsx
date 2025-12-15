import { Box, Grid, Text } from "@chakra-ui/react";

interface StatsCardsProps {
  stats: {
    totalPNodes: number;
    activePNodes: number;
    avgUptime: string;
    avgPerformance: string;
  };
  timeUntilRefresh: number;
  refreshProgress: number;
  onRefresh: () => void;
  loading: boolean;
}

export const StatsCards = ({
  stats,
}: Omit<
  StatsCardsProps,
  "timeUntilRefresh" | "refreshProgress" | "onRefresh" | "loading"
>) => {
  return (
    <Grid
      templateColumns={{
        base: "repeat(1, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(3, 1fr)",
      }}
      gap="16"
      mb="20"
    >
      <Box
        bg="surface"
        border="1px solid"
        borderColor="card.border"
        borderRadius="xl"
        p="20"
        boxShadow="sm"
      >
        <Text
          fontSize="sm"
          color="fg.muted"
          fontWeight="medium"
          mb="8"
          textTransform="uppercase"
          letterSpacing="0.5px"
        >
          Active pNodes
        </Text>
        <Text fontSize="2xl" fontWeight="bold" color="primary" m="0">
          {stats.activePNodes}
        </Text>
        <Text fontSize="sm" color="fg.muted" mt="4">
          {((stats.activePNodes / stats.totalPNodes) * 100 || 0).toFixed(1)}%
          online
        </Text>
      </Box>

      <Box
        bg="surface"
        border="1px solid"
        borderColor="card.border"
        borderRadius="xl"
        p="20"
        boxShadow="sm"
      >
        <Text
          fontSize="sm"
          color="fg.muted"
          fontWeight="medium"
          mb="8"
          textTransform="uppercase"
          letterSpacing="0.5px"
        >
          Avg Uptime
        </Text>
        <Text fontSize="2xl" fontWeight="bold" color="primary" m="0">
          {stats.avgUptime}%
        </Text>
        <Text fontSize="sm" color="fg.muted" mt="4">
          Network reliability
        </Text>
      </Box>

      <Box
        bg="surface"
        border="1px solid"
        borderColor="card.border"
        borderRadius="xl"
        p="20"
        boxShadow="sm"
      >
        <Text
          fontSize="sm"
          color="fg.muted"
          fontWeight="medium"
          mb="8"
          textTransform="uppercase"
          letterSpacing="0.5px"
        >
          Avg Performance
        </Text>
        <Text fontSize="2xl" fontWeight="bold" color="primary" m="0">
          {stats.avgPerformance}
        </Text>
        <Text fontSize="sm" color="fg.muted" mt="4">
          Score out of 100
        </Text>
      </Box>
    </Grid>
  );
};
