import { Badge, Box, Button, Progress, Table, Text } from '@chakra-ui/react';
import { useColorMode } from '../components/ui/color-mode';
import type { PNode, SortKey } from '../types';
import { formatTime } from '../utils/format';
import {
  getStatusBadge,
  getUptimeBadge,
  getReputationBadge,
  getPerformanceBadge,
  getBadgeColor,
  getBadgeBorderColor,
  getBadgeTextColor,
} from '../utils/badges';

interface PNodeTableProps {
  pNodes: PNode[];
  sortBy: SortKey;
  sortOrder: 'asc' | 'desc';
  onSort: (key: SortKey) => void;
  onView: (pNode: PNode) => void;
}

interface SortIconProps {
  columnKey: SortKey;
  sortBy: SortKey;
  sortOrder: 'asc' | 'desc';
}

const SortIcon = ({ columnKey, sortBy, sortOrder }: SortIconProps) => {
  if (sortBy !== columnKey)
    return (
      <Text as="span" opacity={0.5}>
        ↕
      </Text>
    );
  return <Text as="span">{sortOrder === 'asc' ? '↑' : '↓'}</Text>;
};

export const PNodeTable = ({ pNodes, sortBy, sortOrder, onSort, onView }: PNodeTableProps) => {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === 'dark';

  return (
    <Box
      bg="surface"
      border="1px solid"
      borderColor="card.border"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="sm"
    >
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader
              cursor="pointer"
              onClick={() => onSort('identity')}
              _hover={{ bg: 'secondary.hover' }}
            >
              Identity <SortIcon columnKey="identity" sortBy={sortBy} sortOrder={sortOrder} />
            </Table.ColumnHeader>
            <Table.ColumnHeader
              cursor="pointer"
              onClick={() => onSort('status')}
              _hover={{ bg: 'secondary.hover' }}
            >
              Status <SortIcon columnKey="status" sortBy={sortBy} sortOrder={sortOrder} />
            </Table.ColumnHeader>
            <Table.ColumnHeader
              cursor="pointer"
              onClick={() => onSort('uptime')}
              _hover={{ bg: 'secondary.hover' }}
            >
              Uptime <SortIcon columnKey="uptime" sortBy={sortBy} sortOrder={sortOrder} />
            </Table.ColumnHeader>
            <Table.ColumnHeader
              cursor="pointer"
              onClick={() => onSort('performance')}
              _hover={{ bg: 'secondary.hover' }}
            >
              Performance <SortIcon columnKey="performance" sortBy={sortBy} sortOrder={sortOrder} />
            </Table.ColumnHeader>
            <Table.ColumnHeader>Last Heartbeat</Table.ColumnHeader>
            <Table.ColumnHeader>Storage</Table.ColumnHeader>
            <Table.ColumnHeader>Reputation</Table.ColumnHeader>
            <Table.ColumnHeader>Action</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {pNodes.map((pNode) => (
            <Table.Row key={pNode.identity}>
              <Table.Cell>
                <Text fontWeight="bold">{pNode.identity}</Text>
              </Table.Cell>
              <Table.Cell>
                <Badge
                  colorPalette={getStatusBadge(pNode.status)}
                  variant="outline"
                  fontSize="sm"
                  minW="80px"
                  justifyContent="center"
                  px="10px"
                  py="4px"
                  css={{
                    bg: getBadgeColor(getStatusBadge(pNode.status), isDarkMode),
                    borderColor: getBadgeBorderColor(getStatusBadge(pNode.status)),
                    color: getBadgeTextColor(getStatusBadge(pNode.status), isDarkMode),
                    borderWidth: '1px',
                    fontWeight: '600',
                  }}
                >
                  {pNode.status.toUpperCase()}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Box>
                  <Badge
                    colorPalette={getUptimeBadge(pNode.uptime)}
                    variant="outline"
                    fontSize="sm"
                    px="10px"
                    py="4px"
                    mb={pNode.uptime > 0 ? '4' : '0'}
                    css={{
                      bg: getBadgeColor(getUptimeBadge(pNode.uptime), isDarkMode),
                      borderColor: getBadgeBorderColor(getUptimeBadge(pNode.uptime)),
                      color: getBadgeTextColor(getUptimeBadge(pNode.uptime), isDarkMode),
                      borderWidth: '1px',
                      fontWeight: '600',
                    }}
                  >
                    {pNode.uptime.toFixed(2)}%
                  </Badge>
                  {pNode.uptime > 0 && (
                    <Progress.Root value={pNode.uptime} size="sm" mt="4">
                      <Progress.Track>
                        <Progress.Range
                          css={{
                            background: `linear-gradient(90deg, ${
                              pNode.uptime >= 98
                                ? 'rgba(34, 197, 94, 1)'
                                : pNode.uptime >= 95
                                ? 'rgba(230, 129, 97, 1)'
                                : 'rgba(255, 84, 89, 1)'
                            } 0%, ${
                              pNode.uptime >= 98
                                ? 'rgba(33, 128, 141, 1)'
                                : pNode.uptime >= 95
                                ? 'rgba(168, 75, 47, 1)'
                                : 'rgba(192, 21, 47, 1)'
                            } 100%)`,
                          }}
                        />
                      </Progress.Track>
                    </Progress.Root>
                  )}
                </Box>
              </Table.Cell>
              <Table.Cell>
                <Box>
                  <Badge
                    colorPalette={getPerformanceBadge(pNode.performance)}
                    variant="outline"
                    fontSize="sm"
                    px="10px"
                    py="4px"
                    mb={pNode.performance > 0 ? '4' : '0'}
                    css={{
                      bg: getBadgeColor(getPerformanceBadge(pNode.performance), isDarkMode),
                      borderColor: getBadgeBorderColor(getPerformanceBadge(pNode.performance)),
                      color: getBadgeTextColor(getPerformanceBadge(pNode.performance), isDarkMode),
                      borderWidth: '1px',
                      fontWeight: '600',
                    }}
                  >
                    {pNode.performance.toFixed(2)}%
                  </Badge>
                  {pNode.performance > 0 && (
                    <Progress.Root value={pNode.performance} size="sm" mt="4">
                      <Progress.Track>
                        <Progress.Range
                          css={{
                            background: `linear-gradient(90deg, ${
                              pNode.performance >= 90
                                ? 'rgba(34, 197, 94, 1)'
                                : pNode.performance >= 75
                                ? 'rgba(230, 129, 97, 1)'
                                : 'rgba(255, 84, 89, 1)'
                            } 0%, ${
                              pNode.performance >= 90
                                ? 'rgba(33, 128, 141, 1)'
                                : pNode.performance >= 75
                                ? 'rgba(168, 75, 47, 1)'
                                : 'rgba(192, 21, 47, 1)'
                            } 100%)`,
                          }}
                        />
                      </Progress.Track>
                    </Progress.Root>
                  )}
                </Box>
              </Table.Cell>
              <Table.Cell>{formatTime(pNode.lastHeartbeat)}</Table.Cell>
              <Table.Cell>
                {pNode.storageUsed.toFixed(1)} GB / {pNode.storageCap} GB
              </Table.Cell>
              <Table.Cell>
                <Badge
                  colorPalette={getReputationBadge(pNode.reputation)}
                  variant="outline"
                  fontSize="sm"
                  px="10px"
                  py="4px"
                  css={{
                    bg: getBadgeColor(getReputationBadge(pNode.reputation), isDarkMode),
                    borderColor: getBadgeBorderColor(getReputationBadge(pNode.reputation)),
                    color: getBadgeTextColor(getReputationBadge(pNode.reputation), isDarkMode),
                    borderWidth: '1px',
                    fontWeight: '600',
                  }}
                >
                  {pNode.reputation.toFixed(1)}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Button
                  size="sm"
                  variant="outline"
                  colorPalette="gray"
                  color="fg"
                  onClick={() => onView(pNode)}
                  _hover={{
                    bg: 'secondary.hover',
                    color: 'fg',
                  }}
                >
                  View
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
