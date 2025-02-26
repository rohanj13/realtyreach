import React, { FC } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
  Text,
  VStack,
} from "@chakra-ui/react";

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsDrawer: FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Text>Recent Activity</Text>
            <DrawerCloseButton />
          </Box>
        </DrawerHeader>
        <DrawerBody>
          <VStack spacing={6} align="stretch">
            <Box>Notification content goes here.</Box>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default NotificationsDrawer;