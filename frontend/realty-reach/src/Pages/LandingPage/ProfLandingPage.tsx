import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Stack,
  Link,
  Image,
  SimpleGrid,
  Container,
  Icon,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaHandshake, FaClipboardCheck } from 'react-icons/fa';

const ProfLandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Header */}
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        padding="1.5rem"
        backgroundColor="blue.600"
        color="white"
      >
        <Heading size="lg">RealtyReach for Professionals</Heading>
        <Stack direction="row" spacing={5}>
          <Button onClick={() => navigate('/')} variant="ghost" colorScheme="whiteAlpha">
            Home
          </Button>
          <Button onClick={() => navigate('/features')} variant="ghost" colorScheme="whiteAlpha">
            Features
          </Button>
          <Button onClick={() => navigate('/pricing')} variant="ghost" colorScheme="whiteAlpha">
            Pricing
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
        padding="6rem"
        background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        color="white"
      >
        <Box flex="1" textAlign={{ base: 'center', md: 'left' }}>
          <Heading as="h1" size="2xl" mb={4}>
            Grow Your Real Estate Business
          </Heading>
          <Text fontSize="xl" mb={6}>
            Get instant job alerts, connect with potential clients, and close more deals with RealtyReach for Profesionals.
          </Text>
          <Button colorScheme="teal" size="lg" onClick={() => navigate('/register', { state: { role: 'professional' } })}>
            Get Started Now
          </Button>
        </Box>
      </Flex>

      {/* Features Section */}
      <Container maxW="container.xl" mt={20}>
        <Heading as="h2" size="xl" textAlign="center" mb={12}>
          How RealtyReach Works
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <VStack align="center" spacing={4}>
            <Icon as={FaBell} w={12} h={12} color="blue.500" />
            <Heading as="h3" size="lg">
              Get Instant Alerts
            </Heading>
            <Text textAlign="center">
              Receive real-time notifications for new job postings that match your expertise and location.
            </Text>
          </VStack>
          <VStack align="center" spacing={4}>
            <Icon as={FaHandshake} w={12} h={12} color="blue.500" />
            <Heading as="h3" size="lg">
              Connect with Clients
            </Heading>
            <Text textAlign="center">
              Easily respond to potential clients and showcase your services through our platform.
            </Text>
          </VStack>
          <VStack align="center" spacing={4}>
            <Icon as={FaClipboardCheck} w={12} h={12} color="blue.500" />
            <Heading as="h3" size="lg">
              Provide Quotes
            </Heading>
            <Text textAlign="center">
              Send professional quotes and proposals directly through our streamlined system.
            </Text>
          </VStack>
        </SimpleGrid>
      </Container>

      {/* Testimonials Section */}
      <Box bg="gray.50" py={20} mt={20}>
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" textAlign="center" mb={12}>
            What Our Professionals Say
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            <Box bg="white" p={6} borderRadius="md" boxShadow="md">
              <Text fontSize="lg" fontStyle="italic" mb={4}>
                "RealtyReach has revolutionized how I connect with clients. The instant job alerts have helped me secure more deals than ever before."
              </Text>
              <Text fontWeight="bold">- Sarah Johnson, Real Estate Agent</Text>
            </Box>
            <Box bg="white" p={6} borderRadius="md" boxShadow="md">
              <Text fontSize="lg" fontStyle="italic" mb={4}>
                "As a mortgage broker, I've seen a significant increase in my client base since using RealtyReach. The platform makes it easy to provide quotes and connect with potential clients."
              </Text>
              <Text fontWeight="bold">- Michael Chen, Mortgage Broker</Text>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box bg="blue.600" color="white" py={20}>
        <Container maxW="container.xl" textAlign="center">
          <Heading as="h2" size="xl" mb={6}>
            Ready to Boost Your Real Estate Career?
          </Heading>
          <Text fontSize="xl" mb={8}>
            Join thousands of professionals who are growing their business with RealtyReach Pro.
          </Text>
          <Button colorScheme="teal" size="lg" onClick={() => navigate('/register', { state: { role: 'professional' } })}>
            Sign Up Now
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Flex as="footer" justify="center" align="center" padding="2rem" backgroundColor="gray.800" color="white">
        <Text>© 2024 RealtyReach Pro. All rights reserved.</Text>
      </Flex>
    </Box>
  );
};

export default ProfLandingPage;