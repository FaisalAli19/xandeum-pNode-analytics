import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { ColorModeButton } from './ui/color-mode';

interface HeaderProps {
  activePNodes: number;
  lastUpdated?: Date | null;
}

export const Header = ({ activePNodes }: HeaderProps) => {
  return (
    <Box
      as="header"
      bg="surface"
      borderBottom="1px solid"
      borderColor="card.border"
      px="20"
      py="20"
      boxShadow="sm"
      position="sticky"
      top="0"
      zIndex="100"
    >
      <Box maxW="1400px" mx="auto">
        <Flex justify="space-between" align="center" gap="16" flexWrap="wrap">
          <Box>
            <Text as="h1" fontSize="3xl" color="primary" fontWeight="bold" m="0">
              ⛓️ Xandeum pNodes
            </Text>
            <Text fontSize="sm" color="fg.muted" mt="4" mb="0">
              Analytics Dashboard
            </Text>
          </Box>
          <HStack gap="12" flexWrap="wrap">
            <HStack gap="8" px="12" py="8" bg="secondary" borderRadius="md" fontSize="sm">
              <Box
                width="8px"
                height="8px"
                borderRadius="full"
                bg={activePNodes > 0 ? 'success' : 'error'}
                data-status-dot
              />
              <Text>{activePNodes} Active</Text>
            </HStack>
            <ColorModeButton />
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
};
