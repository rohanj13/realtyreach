import React, { useState } from 'react';
import { Box, Button, Input, FormControl, FormLabel, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Auth';

const UserRegistrationPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await register(email, password);
      navigate('/login'); // Redirect to login after successful registration
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Box p={4} maxWidth="400px" mx="auto">
      <FormControl mb={4}>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </FormControl>
      {error && <Text color="red.500">{error}</Text>}
      <Button colorScheme="blue" onClick={handleSubmit} width="full">
        Register
      </Button>
      <Text mt={4}>
        Already have an account? <a href="/login">Login</a>
      </Text>
    </Box>
  );
};

export default UserRegistrationPage;
