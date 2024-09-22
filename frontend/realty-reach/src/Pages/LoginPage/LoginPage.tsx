import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Checkbox,
  Link,
  IconButton,
} from '@chakra-ui/react';
import { FaFacebook, FaGoogle, FaLinkedin } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/Auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      if (isAuthenticated) {
        navigate(from, { replace: true });
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('An error occurred during login.');
    }
  };

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Box
        width="50%"
        height="100vh"
        backgroundImage="url('https://example.com/background-image.jpg')"
        backgroundSize="cover"
        backgroundPosition="center"
        display={{ base: 'none', md: 'block' }}
      >
        <Box p={8} color="white">
          <Text fontSize="4xl" fontWeight="bold">
            RealtyReach
          </Text>
          <Text mt={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
            suscipit gravida dictumst eget. 
          </Text>
        </Box>
      </Box>

      <Box width={{ base: '100%', md: '50%' }} p={8}>
        <Box mb={8}>
          <Text fontSize="2xl" fontWeight="bold">
            Welcome
          </Text>
          <Text>Login to continue</Text>
        </Box>

        <Stack spacing={4} as="form" onSubmit={handleSubmit}>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <Flex justifyContent="space-between">
            <Checkbox>Remember Me</Checkbox>
            <Link color="blue.500">Forgot Password?</Link>
          </Flex>

          {error && (
            <Text color="red.500" textAlign="center">
              {error}
            </Text>
          )}

          <Button colorScheme="blue" type="submit" size="lg">
            Login
          </Button>

          <Text textAlign="center" mt={4}>
            or continue with
          </Text>

          <Flex justifyContent="center" mt={4}>
            <IconButton
              aria-label="Login with Facebook"
              icon={<FaFacebook />}
              isRound
              mx={2}
            />
            <IconButton
              aria-label="Login with Google"
              icon={<FaGoogle />}
              isRound
              mx={2}
            />
            <IconButton
              aria-label="Login with LinkedIn"
              icon={<FaLinkedin />}
              isRound
              mx={2}
            />
          </Flex>
        </Stack>

        <Text textAlign="center" mt={8}>
          Don't have an account?{' '}
          <Link color="blue.500" onClick={() => navigate('/register')}>
            Signup
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default Login;
