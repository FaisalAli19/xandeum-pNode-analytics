import { Box, Input } from '@chakra-ui/react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <Box bg="surface" border="1px solid" borderColor="card.border" borderRadius="xl" p="16" mb="20">
      <Input
        type="text"
        placeholder="Search by pNode identity or peer ID..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        size="md"
        width="100%"
      />
    </Box>
  );
};
