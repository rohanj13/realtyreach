import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  Link,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";

type ProfessionalFormsInputs = {
  email: string;
  password: string;
  confirmPassword: string;
  professionalType: string;
};

const validation = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Invalid email"),
  password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
  professionalType: Yup.string().required("Please select a professional type"),
});

const ProfessionalRegisterPage = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfessionalFormsInputs>({
    resolver: yupResolver(validation),
  });

  const handleRegister = (form: ProfessionalFormsInputs) => {
    registerUser(form.email, form.password, `professional:${form.professionalType}`);
  };

  return (
    <Container maxW="md" py={12} px={6}>
      <Box bg="white" p={8} borderWidth={1} borderColor="gray.200" borderRadius="lg" boxShadow="lg">
        <Heading as="h1" mb={6} fontSize="2xl" textAlign="center">
          Create Your Professional Account
        </Heading>
        <form onSubmit={handleSubmit(handleRegister)}>
          <Stack spacing={4}>
            {/* Professional Type Dropdown */}
            <FormControl id="professionalType" isInvalid={!!errors.professionalType}>
              <FormLabel>Professional Type</FormLabel>
              <Select placeholder="Select your profession" {...register("professionalType")}>
                <option value="buyersAdvocate">Buyers Advocate</option>
                <option value="mortgageBroker">Mortgage Broker</option>
                <option value="conveyancer">Conveyancer</option>
                <option value="buildingInspector">Building and Pest Inspector</option>
              </Select>
              <FormErrorMessage>{errors.professionalType?.message}</FormErrorMessage>
            </FormControl>

            {/* Email Field */}
            <FormControl id="email" isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="Enter your email" {...register("email")} />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            {/* Password Field */}
            <FormControl id="password" isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input type="password" placeholder="Enter your password" {...register("password")} />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            {/* Confirm Password Field */}
            <FormControl id="confirmPassword" isInvalid={!!errors.confirmPassword}>
              <FormLabel>Confirm Password</FormLabel>
              <Input type="password" placeholder="Confirm your password" {...register("confirmPassword")} />
              <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
            </FormControl>

            {/* Submit Button */}
            <Button colorScheme="teal" type="submit" size="lg" fontSize="md" width="full">
              Sign Up as Professional
            </Button>
          </Stack>

          <Button
              variant="outline"
              size="lg"
              fontSize="md"
              width="full"
              onClick={() => navigate('/')}
              mt={4}
            >
              Sign up as a Customer instead
            </Button>

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

export default ProfessionalRegisterPage;
