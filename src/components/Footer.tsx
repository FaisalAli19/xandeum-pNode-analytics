import { Box, Container, Flex, Link, Text } from "@chakra-ui/react";
import { LuGithub } from "react-icons/lu";

export const Footer = () => {
  return (
    <Box as="footer" py="8" borderTop="1px solid" borderColor="border" bg="bg">
      <Container maxW="1400px" px="20">
        <Flex justify="center" align="center" gap="2">
          <Text color="fg.muted" fontSize="sm">
            © {new Date().getFullYear()} pNode Analytics Dashboard. Built by
          </Text>
          <Link
            href="https://github.com/FaisalAli19"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            fontWeight="medium"
            display="inline-flex"
            alignItems="center"
            gap="1"
            _hover={{ textDecoration: "underline" }}
          >
            FaisalAli
            <LuGithub size={14} />
          </Link>
        </Flex>
      </Container>
    </Box>
  );
};
