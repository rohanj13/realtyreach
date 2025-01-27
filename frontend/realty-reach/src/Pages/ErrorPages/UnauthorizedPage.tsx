import React from "react";
import { Box, Button, Center, Heading, Text, VStack, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const UnauthorizedPage: React.FC = () => {
  return (
    <Center minH="100vh" bg="gray.50" p={6}>
      <VStack spacing={8} textAlign="center">
        {/* Illustration */}
        <Image
          src="https://via.placeholder.com/400x300?text=Unauthorized" // Replace with a relevant illustration
          alt="Unauthorized Access"
          boxSize="300px"
          objectFit="contain"
        />
        {/* Heading */}
        <Heading color="red.500" size="xl">
          Unauthorized Access
        </Heading>
        {/* Description */}
        <Text fontSize="lg" color="gray.600" maxW="md">
          Oops! You don’t have permission to view this page. Please check your role or login with an authorized account.
        </Text>
        {/* Action Buttons */}
        <VStack spacing={4}>
          <Button as={Link} to="/" colorScheme="blue" size="lg" width="full">
            Back to Home
          </Button>
          <Button as={Link} to="/login" colorScheme="gray" variant="outline" size="lg" width="full">
            Login with a Different Account
          </Button>
        </VStack>
      </VStack>
    </Center>
  );
};

export default UnauthorizedPage;
