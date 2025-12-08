import { Button, HStack } from '@chakra-ui/react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <HStack justify="center" gap="8" p="16" mt="16">
      <Button
        variant="outline"
        colorPalette="gray"
        color="fg"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        _hover={{
          bg: 'secondary.hover',
          color: 'fg',
        }}
      >
        ← Previous
      </Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? 'solid' : 'outline'}
          colorPalette={currentPage === page ? 'teal' : 'gray'}
          color={currentPage === page ? undefined : 'fg'}
          onClick={() => onPageChange(page)}
          _hover={{
            bg: currentPage === page ? undefined : 'secondary.hover',
            color: 'fg',
          }}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="outline"
        colorPalette="gray"
        color="fg"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        _hover={{
          bg: 'secondary.hover',
          color: 'fg',
        }}
      >
        Next →
      </Button>
    </HStack>
  );
};
