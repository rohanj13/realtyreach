// LandingPage.tsx
import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Stack,
  Link,
  SimpleGrid,
  Container,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Header */}
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        padding="1.5rem"
        backgroundColor="blue.500"
        color="white"
      >
        <Heading size="lg">RealtyReach</Heading>
        <Stack direction="row" spacing={5}>
          <Button onClick={() => navigate('/')} colorScheme="white">
            Home
          </Button>
          <Button onClick={() => navigate('/blog')} colorScheme="white">
            Blog
          </Button>
          <Button onClick={() => navigate('/aboutus')} colorScheme="white">
            About Us
          </Button>
          <Button onClick={() => navigate('/professionals')} colorScheme="purple">
            For Professionals
          </Button>
          <Button onClick={() => navigate('/login')} colorScheme="teal">
            Login
          </Button>
        </Stack>
      </Flex>

      {/* Hero Section */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align="center"
        justify="center"
        padding="4rem"
        background="gray.100"
      >
        <Box flex="1" textAlign={{ base: 'center' }}>
          <Heading as="h1" size="2xl" mb={4}>
            Find the Right Property Professional for Your Next House
          </Heading>
          <Text fontSize="lg" mb={6}>
            Get in touch with the best professionals in your area for all your property needs.
          </Text>
          <Button colorScheme="blue" size="lg" onClick={() => navigate('/register', { state: { role: 'customer' } })}>
            Get Started Now
          </Button>
        </Box>
      </Flex>

      {/* How it works Section */}
      <Container maxW="container.xl" mt={10}>
        <Heading as="h2" size="xl" textAlign="center" mb={6}>
          How it works
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <Box>
            <Heading as="h3" size="md" mt={4}>
              Tell us what you need
            </Heading>
            <Text mt={2}>Answer a few quick questions about your situation.</Text>
          </Box>
          <Box>
            <Heading as="h3" size="md" mt={4}>
              Get in touch with property professionals
            </Heading>
            <Text mt={2}>We will match you with relevant professionals instantly.</Text>
          </Box>
          <Box>
            <Heading as="h3" size="md" mt={4}>
              Choose the right one for your needs!
            </Heading>
            <Text mt={2}>Compare different profiles and get started.</Text>
          </Box>
        </SimpleGrid>
      </Container>

      {/* Blog Section */}
      <Container maxW="container.xl" mt={10}>
        <Heading as="h2" size="xl" textAlign="center" mb={6}>
          Latest Articles
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <Box>
            <Heading as="h3" size="md" mt={4}>
              How to Choose the Right Property Professional
            </Heading>
            <Text mt={2}>Learn the top tips for finding the right professional for your needs.</Text>
            <Link color="blue.500" mt={2} display="inline-block">
              Read More
            </Link>
          </Box>
          <Box>
            <Heading as="h3" size="md" mt={4}>
              The Importance of Property Inspections
            </Heading>
            <Text mt={2}>Discover why regular property inspections are crucial.</Text>
            <Link color="blue.500" mt={2} display="inline-block">
              Read More
            </Link>
          </Box>
          <Box>
            <Heading as="h3" size="md" mt={4}>
              Understanding Property Laws in Your Area
            </Heading>
            <Text mt={2}>Stay informed about the latest property laws and regulations.</Text>
            <Link color="blue.500" mt={2} display="inline-block">
              Read More
            </Link>
          </Box>
        </SimpleGrid>
      </Container>

      {/* Footer */}
      <Flex as="footer" justify="center" align="center" padding="2rem" backgroundColor="blue.500" color="white">
        <Text>© 2024 RealtyReach. All rights reserved.</Text>
      </Flex>
    </Box>
  );
};

export default LandingPage;
