import { Box, Skeleton, Table } from '@chakra-ui/react';

export const SkeletonLoader = () => {
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
            <Table.ColumnHeader>Identity</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
            <Table.ColumnHeader>Uptime</Table.ColumnHeader>
            <Table.ColumnHeader>Performance</Table.ColumnHeader>
            <Table.ColumnHeader>Last Heartbeat</Table.ColumnHeader>
            <Table.ColumnHeader>Storage</Table.ColumnHeader>
            <Table.ColumnHeader>Reputation</Table.ColumnHeader>
            <Table.ColumnHeader>Action</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Array.from({ length: 5 }).map((_, idx) => (
            <Table.Row key={idx}>
              <Table.Cell>
                <Skeleton height="16px" width="120px" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton height="16px" width="80px" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton height="16px" width="100px" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton height="16px" width="100px" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton height="16px" width="110px" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton height="16px" width="130px" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton height="16px" width="80px" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton height="16px" width="70px" />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
