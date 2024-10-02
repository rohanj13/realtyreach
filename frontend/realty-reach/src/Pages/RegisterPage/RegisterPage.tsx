import React, { useState } from "react";
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
  RadioGroup,
  Radio,
  HStack,
  Link,
} from "@chakra-ui/react";

type Props = {};

type RegisterFormsInputs = {
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
};

const validation = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Invalid email"),
  password: Yup.string().required("Password is required")
  .min(8, 'Password must be at least 8 characters'),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  role: Yup.string().required("Role is required"),
});

const RegisterPage = (props: Props) => {
  const { registerUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string>("customer");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormsInputs>({
    resolver: yupResolver(validation),
    defaultValues: { role: selectedRole },
  });

  const handleRegister = (form: RegisterFormsInputs) => {
    registerUser(form.email, form.password, selectedRole);
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
          Create your account
        </Heading>
        <form onSubmit={handleSubmit(handleRegister)}>
          <Stack spacing={4}>
            {/* Role Selection */}
            <FormControl id="role" isInvalid={!!errors.role}>
              <FormLabel>Select your role</FormLabel>
              <RadioGroup
                value={selectedRole}
                onChange={setSelectedRole}
                defaultValue="customer"
              >
                <HStack spacing={4}>
                  <Radio value="customer">Customer</Radio>
                  <Radio value="professional">Professional</Radio>
                </HStack>
              </RadioGroup>
              <FormErrorMessage>{errors.role?.message}</FormErrorMessage>
            </FormControl>

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
              Sign up
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
