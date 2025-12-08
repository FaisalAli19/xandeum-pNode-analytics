import { Box, Button, Grid, Progress, Text } from '@chakra-ui/react';

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
  timeUntilRefresh,
  refreshProgress,
  onRefresh,
  loading,
}: StatsCardsProps) => {
  return (
    <Grid
      templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(5, 1fr)' }}
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
          Total pNodes
        </Text>
        <Text fontSize="2xl" fontWeight="bold" color="primary" m="0">
          {stats.totalPNodes}
        </Text>
        <Text fontSize="sm" color="fg.muted" mt="4">
          Network participants
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
          Active pNodes
        </Text>
        <Text fontSize="2xl" fontWeight="bold" color="primary" m="0">
          {stats.activePNodes}
        </Text>
        <Text fontSize="sm" color="fg.muted" mt="4">
          {((stats.activePNodes / stats.totalPNodes) * 100 || 0).toFixed(1)}% online
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

      <Box
        bg="surface"
        border="1px solid"
        borderColor="card.border"
        borderRadius="xl"
        p="20"
        boxShadow="sm"
        position="relative"
      >
        <Button
          position="absolute"
          top="16"
          right="16"
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          opacity={loading ? 0.6 : 1}
          fontSize="20px"
          p="0"
          minW="auto"
          h="auto"
        >
          🔄
        </Button>
        <Text
          fontSize="sm"
          color="fg.muted"
          fontWeight="medium"
          mb="8"
          textTransform="uppercase"
          letterSpacing="0.5px"
        >
          Next Refresh
        </Text>
        <Text fontSize="2xl" fontWeight="bold" color="primary" m="0">
          {timeUntilRefresh}s
        </Text>
        <Progress.Root value={refreshProgress} mt="12" size="sm" colorPalette="teal">
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
      </Box>
    </Grid>
  );
};
