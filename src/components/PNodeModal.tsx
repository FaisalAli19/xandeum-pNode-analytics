import { Badge, Box, Button, Dialog, Flex, HStack, Text } from '@chakra-ui/react';
import { LuCopy } from 'react-icons/lu';
import { useState } from 'react';
import { toaster } from './ui/toaster';
import { useColorMode } from './ui/color-mode';
import type { PNode } from '../types';
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

interface PNodeModalProps {
  pNode: PNode | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PNodeModal = ({ pNode, isOpen, onClose }: PNodeModalProps) => {
  const [copied, setCopied] = useState(false);
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === 'dark';

  if (!pNode) return null;

  const handleCopyPeerId = async () => {
    await navigator.clipboard.writeText(pNode.peerId);
    setCopied(true);
    toaster.create({
      title: 'Copied!',
      description: 'Peer ID copied to clipboard',
      type: 'success',
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(details) => !details.open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner display="flex" alignItems="center" justifyContent="center">
        <Dialog.Content maxW="600px" w="90%" bg="surface" boxShadow="lg">
          <Dialog.Header>
            <Flex
              justify="space-between"
              align="center"
              mb="16"
              pb="16"
              borderBottom="1px solid"
              borderColor="border"
            >
              <HStack gap="12" flexWrap="wrap">
                <Text as="h2" fontSize="xl" color="primary" m="0">
                  {pNode.identity}
                </Text>
                <Badge
                  colorPalette={getStatusBadge(pNode.status)}
                  variant="outline"
                  fontSize="sm"
                  px="10"
                  py="4"
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
              </HStack>
              <Dialog.CloseTrigger />
            </Flex>
          </Dialog.Header>

          <Dialog.Body>
            <Box mb="16">
              <Flex
                justify="space-between"
                align="center"
                py="12"
                borderBottom="1px solid"
                borderColor="border"
              >
                <Text color="fg.muted" fontWeight="medium">
                  Uptime
                </Text>
                <Badge
                  colorPalette={getUptimeBadge(pNode.uptime)}
                  variant="outline"
                  fontSize="sm"
                  px="10"
                  py="4"
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
              </Flex>

              <Flex
                justify="space-between"
                align="center"
                py="12"
                borderBottom="1px solid"
                borderColor="border"
              >
                <Text color="fg.muted" fontWeight="medium">
                  Performance Score
                </Text>
                <Badge
                  colorPalette={getPerformanceBadge(pNode.performance)}
                  variant="outline"
                  fontSize="sm"
                  px="10"
                  py="4"
                  css={{
                    bg: getBadgeColor(getPerformanceBadge(pNode.performance), isDarkMode),
                    borderColor: getBadgeBorderColor(getPerformanceBadge(pNode.performance)),
                    color: getBadgeTextColor(getPerformanceBadge(pNode.performance), isDarkMode),
                    borderWidth: '1px',
                    fontWeight: '600',
                  }}
                >
                  {pNode.performance}/100
                </Badge>
              </Flex>

              <Flex
                justify="space-between"
                align="center"
                py="12"
                borderBottom="1px solid"
                borderColor="border"
              >
                <Text color="fg.muted" fontWeight="medium">
                  Reputation
                </Text>
                <Badge
                  colorPalette={getReputationBadge(pNode.reputation)}
                  variant="outline"
                  fontSize="sm"
                  px="10"
                  py="4"
                  css={{
                    bg: getBadgeColor(getReputationBadge(pNode.reputation), isDarkMode),
                    borderColor: getBadgeBorderColor(getReputationBadge(pNode.reputation)),
                    color: getBadgeTextColor(getReputationBadge(pNode.reputation), isDarkMode),
                    borderWidth: '1px',
                    fontWeight: '600',
                  }}
                >
                  {pNode.reputation.toFixed(2)}
                </Badge>
              </Flex>

              <Flex
                justify="space-between"
                align="center"
                py="12"
                borderBottom="1px solid"
                borderColor="border"
              >
                <Text color="fg.muted" fontWeight="medium">
                  Peer ID
                </Text>
                <HStack
                  as="button"
                  fontFamily="mono"
                  fontSize="sm"
                  color={copied ? 'green.800' : 'fg.muted'}
                  px="8"
                  py="4"
                  bg={copied ? 'green.200' : 'secondary'}
                  borderRadius="sm"
                  cursor="pointer"
                  onClick={handleCopyPeerId}
                  _hover={{ bg: 'secondary.hover' }}
                  title={pNode.peerId}
                  gap="4"
                  transition="color 0.2s"
                >
                  <Text>{copied ? 'Copied!' : `${pNode.peerId.substring(0, 16)}...`}</Text>
                  <LuCopy size={14} />
                </HStack>
              </Flex>

              <Flex
                justify="space-between"
                align="center"
                py="12"
                borderBottom="1px solid"
                borderColor="border"
              >
                <Text color="fg.muted" fontWeight="medium">
                  Version
                </Text>
                <Text fontWeight="semibold">v{pNode.version}</Text>
              </Flex>

              <Flex
                justify="space-between"
                align="center"
                py="12"
                borderBottom="1px solid"
                borderColor="border"
              >
                <Text color="fg.muted" fontWeight="medium">
                  Slots Produced
                </Text>
                <Text fontWeight="semibold">{pNode.slotsProduced.toLocaleString()}</Text>
              </Flex>

              <Flex
                justify="space-between"
                align="center"
                py="12"
                borderBottom="1px solid"
                borderColor="border"
              >
                <Text color="fg.muted" fontWeight="medium">
                  Slots Skipped
                </Text>
                <Text fontWeight="semibold">{pNode.slotsSkipped}</Text>
              </Flex>

              <Flex
                justify="space-between"
                align="center"
                py="12"
                borderBottom="1px solid"
                borderColor="border"
              >
                <Text color="fg.muted" fontWeight="medium">
                  Storage Usage
                </Text>
                <Text fontWeight="semibold">
                  {pNode.storageUsed.toFixed(1)} GB / {pNode.storageCap} GB
                </Text>
              </Flex>

              <Flex justify="space-between" align="center" py="12">
                <Text color="fg.muted" fontWeight="medium">
                  Last Heartbeat
                </Text>
                <Text fontWeight="semibold">{formatTime(pNode.lastHeartbeat)}</Text>
              </Flex>
            </Box>
          </Dialog.Body>

          <Dialog.Footer pt="16" pb="24">
            <Button colorPalette="teal" onClick={onClose} width="100%">
              Close
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
