import { Box, Flex, Text } from "@chakra-ui/react";

export const Header = () => {
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
        <Flex justify="center" align="center" flexWrap="wrap">
          <Box textAlign="center">
            <Text
              as="h1"
              fontSize="3xl"
              color="primary"
              fontWeight="bold"
              m="0"
            >
              ⛓️ Xandeum pNodes
            </Text>
            <Text fontSize="sm" color="fg.muted" mt="4" mb="0">
              Analytics Dashboard
            </Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};
