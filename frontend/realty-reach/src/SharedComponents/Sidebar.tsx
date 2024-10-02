import React from 'react';
import { Box, VStack, Button, Text, useColorMode, Switch, Flex, useColorModeValue } from '@chakra-ui/react';
import { FiHome, FiFileText, FiMessageSquare, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../Context/useAuth';

const Sidebar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { logout } = useAuth();

  // Automatically set background color based on the color mode
  const bgColor = useColorModeValue('gray.100', 'gray.800'); // Light mode uses 'gray.100', dark mode uses 'gray.800'
  const textColor = useColorModeValue('black', 'white'); // Adjust text color based on color mode

  return (
    <Box
      w="250px"
      bg={bgColor} // Use the dynamic background color
      p={4}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <VStack align="start" spacing={4}>
        <Text fontSize="2xl" fontWeight="bold" color={textColor}> {/* Dynamically set text color */}
          RealtyReach
        </Text>
        <Button variant="ghost" justifyContent="start" width="full" leftIcon={<FiHome />} color={textColor}>
          Home
        </Button>
        <Button variant="ghost" justifyContent="start" width="full" leftIcon={<FiFileText />} color={textColor}>
          My Requests
        </Button>
        <Button variant="ghost" justifyContent="start" width="full" leftIcon={<FiMessageSquare />} color={textColor}>
          My Messages
        </Button>
        <Button variant="ghost" justifyContent="start" width="full" leftIcon={<FiFileText />} color={textColor}>
          My Documents
        </Button>
        <Button variant="ghost" justifyContent="start" width="full" leftIcon={<FiUser />} color={textColor}>
          Profile
        </Button>
        <Button variant="ghost" justifyContent="start" width="full" leftIcon={<FiSettings />} color={textColor}>
          Settings
        </Button>
      </VStack>
      <VStack align="start">
        <Flex align="center">
          <Text color={textColor}>Dark Mode</Text>
          <Switch isChecked={colorMode === 'dark'} onChange={toggleColorMode} ml={2} />
        </Flex>
        <Button variant="ghost" justifyContent="start" width="full" leftIcon={<FiLogOut />} onClick={logout} color={textColor}>
          Logout
        </Button>
      </VStack>
    </Box>
  );
};

export default Sidebar;
