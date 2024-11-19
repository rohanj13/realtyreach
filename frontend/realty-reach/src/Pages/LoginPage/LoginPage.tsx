import React from "react";
import * as Yup from "yup";
import { useAuth } from "../../Context/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";

import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink, LinkProps } from '@chakra-ui/react'

type Props = {};

type LoginFormsInputs = {
  email: string;
  password: string;
};

const validation = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage = (props: Props) => {
  const { loginUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormsInputs>({ resolver: yupResolver(validation) });

  const handleLogin = (form: LoginFormsInputs) => {
    loginUser(form.email, form.password);
  };

  return (
    <Container maxW="md" py={12} px={6}>
      <Box
        bg="white"
        boxShadow="lg"
        p={8}
        rounded="lg"
        borderWidth={1}
        borderColor="gray.200"
      >
        <Heading as="h1" mb={6} fontSize="2xl" textAlign="center">
          Sign in to your account
        </Heading>
        <form onSubmit={handleSubmit(handleLogin)}>
          <Stack spacing={4}>
            <FormControl id="email" isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="text"
                placeholder="Enter your email"
                {...register("email")}
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl id="password" isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                {...register("password")}
              />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            <Stack direction="row" justify="space-between" align="center">
              <Link color="blue.500" fontSize="sm">
                Forgot password?
              </Link>
            </Stack>

            <Button
              colorScheme="teal"
              type="submit"
              size="lg"
              fontSize="md"
              width="full"
            >
              Sign In
            </Button>
          </Stack>
        </form>

        <Text mt={6} textAlign="center" fontSize="sm">
          Don’t have an account yet?{" "}
          <ChakraLink color="teal.500" as={ReactRouterLink} to="/register">
            Sign up
          </ChakraLink>
        </Text>
      </Box>
    </Container>
  );
};

export default LoginPage;
