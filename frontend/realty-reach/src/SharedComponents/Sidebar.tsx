import React from 'react';
import { Box, VStack, Button, Text, useColorMode, Switch, Flex } from '@chakra-ui/react';
import { FiHome, FiFileText, FiMessageSquare, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../Context/Auth';

const Sidebar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { logout, isAuthenticated } = useAuth();
  return (
    <Box
      w="250px"
      bg="gray.100"
      p={4}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <VStack align="start" spacing={4}>
        <Text fontSize="2xl" fontWeight="bold">
          RealtyReach
        </Text>
        <Button variant="ghost" justifyContent="start" width="full" leftIcon={<FiHome />}>
          Home
        </Button>
        <Button variant="ghost" justifyContent="start" width="full" leftIcon={<FiFileText />}>
          My Requests
        </Button>
        <Button variant="ghost" justifyContent="start" width="full" leftIcon={<FiMessageSquare />}>
          My Messages
        </Button>
        <Button variant="ghost" justifyContent="start" width="full" leftIcon={<FiFileText />}>
          My Documents
        </Button>
        <Button variant="ghost" justifyContent="start" width="full" leftIcon={<FiUser />}>
          Profile
        </Button>
        <Button variant="ghost" justifyContent="start" width="full" leftIcon={<FiSettings />}>
          Settings
        </Button>
      </VStack>
      <VStack align="start">
        <Flex align="center">
          <Text>Dark Mode</Text>
          <Switch isChecked={colorMode === 'dark'} onChange={toggleColorMode} ml={2} />
        </Flex>
        <Button variant="ghost" justifyContent="start" width="full" leftIcon={<FiLogOut />} onClick={logout}>
          Logout
        </Button>
      </VStack>
    </Box>
  );
};

export default Sidebar;
