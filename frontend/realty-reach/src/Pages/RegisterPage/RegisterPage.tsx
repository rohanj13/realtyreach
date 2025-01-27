import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../Context/useAuth";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Link,
} from "@chakra-ui/react";

type RegisterFormsInputs = {
  email: string;
  password: string;
  confirmPassword: string;
};

const validation = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Invalid email"),
  password: Yup.string().required("Password is required")
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

const RegisterPage = () => {
  const { registerUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>("customer");

  // Set the role based on the location state when the component mounts
  useEffect(() => {
    if (location.state && location.state.role) {
      setSelectedRole(location.state.role);
    }
  }, [location.state]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormsInputs>({
    resolver: yupResolver(validation),
  });

  const handleRegister = (form: RegisterFormsInputs) => {
    registerUser(form.email, form.password, selectedRole);
  };

  const switchRole = () => {
    // Toggle between customer and professional
    setSelectedRole(prevRole => prevRole === 'customer' ? 'professional' : 'customer');
  };

  return (
    <Container maxW="md" py={12} px={6}>
      <Box
        bg="white"
        p={8}
        borderWidth={1}
        borderColor="gray.200"
        borderRadius="lg"
        boxShadow="lg"
      >
        <Heading as="h1" mb={6} fontSize="2xl" textAlign="center">
          Create your account as a {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
        </Heading>
        <form onSubmit={handleSubmit(handleRegister)}>
          <Stack spacing={4}>
            {/* Email Field */}
            <FormControl id="email" isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                {...register("email")}
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            {/* Password Field */}
            <FormControl id="password" isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                {...register("password")}
              />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            <FormControl id="confirmPassword" isInvalid={!!errors.confirmPassword}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password again"
                {...register("confirmPassword")}
              />
              <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
            </FormControl>

            {/* Submit Button */}
            <Button
              colorScheme="teal"
              type="submit"
              size="lg"
              fontSize="md"
              width="full"
            >
              Sign up as a {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
            </Button>

            {/* Switch Role Button */}
            <Button
              variant="outline"
              size="lg"
              fontSize="md"
              width="full"
              onClick={switchRole}
              mt={4}
            >
              Sign up as a {selectedRole === 'customer' ? 'Professional' : 'Customer'} instead
            </Button>

            {/* Go Back Button */}
            <Button
              variant="link"
              size="md"
              colorScheme="teal"
              onClick={() => navigate(-1)}
              mt={2}
            >
              Go Back
            </Button>
          </Stack>
        </form>

        <Text mt={6} textAlign="center" fontSize="sm">
          Already have an account?{" "}
          <Link color="teal.500" href="/login">
            Sign in
          </Link>
        </Text>
      </Box>
    </Container>
  );
};

export default RegisterPage;
