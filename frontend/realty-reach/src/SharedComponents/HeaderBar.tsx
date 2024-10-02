// Header.tsx
import React from 'react';
import { Flex, Input, Avatar, Text } from '@chakra-ui/react';

const Header: React.FC = () => {
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      p={4}
      bg="white"
      boxShadow="sm"
    >
      <Text fontSize="xl" fontWeight="bold">
        Dashboard
      </Text>
      <Flex alignItems="center">
        <Input placeholder="Search..." width="300px" mr={4} />
        <Avatar size="sm" name="User" src="https://bit.ly/broken-link" />
      </Flex>
    </Flex>
  );
};

export default Header;
