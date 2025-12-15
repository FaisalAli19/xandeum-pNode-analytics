import { Button, HStack } from "@chakra-ui/react";
import type { FilterStatus } from "../types";
import type { PNode } from "../types";

interface FilterTabsProps {
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  pNodes: PNode[];
}

export const FilterTabs = ({
  filterStatus,
  onFilterChange,
  pNodes,
}: FilterTabsProps) => {
  const getCount = (status: FilterStatus): number => {
    if (status === "all") return pNodes.length;
    return pNodes.filter((p) => p.status === status).length;
  };

  return (
    <HStack gap="8" mb="16" flexWrap="wrap">
      {(["active", "inactive"] as const).map((status) => (
        <Button
          key={status}
          variant={filterStatus === status ? "solid" : "outline"}
          colorPalette={filterStatus === status ? "teal" : "gray"}
          color={filterStatus === status ? undefined : "fg"}
          onClick={() => onFilterChange(status)}
          size="sm"
          fontWeight="medium"
          _hover={{
            bg: filterStatus === status ? undefined : "secondary.hover",
            color: "fg",
          }}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)} ({getCount(status)}
          )
        </Button>
      ))}
    </HStack>
  );
};
