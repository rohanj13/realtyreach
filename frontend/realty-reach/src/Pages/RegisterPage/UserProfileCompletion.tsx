import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
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
  Stack,
  Text,
  Link,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { updateUser } from "../../services/AuthService";

// Define the types for form inputs
type ProfileCompletionInputs = {
  firstName: string;
  lastName: string;
};

// Define validation schema using Yup
const validation = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
});

const UserProfileCompletionPage = () => {
  const navigate = useNavigate();

  // Use react-hook-form with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileCompletionInputs>({
    resolver: yupResolver(validation),
  });

  // Handle form submission
  const handleProfileCompletion = async (form: ProfileCompletionInputs) => {
    try {
      // Retrieve the user object from localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userObj = JSON.parse(storedUser);

        // Update the user object with new first and last name
        const updatedUser = {
          ...userObj,
          firstName: form.firstName,
          lastName: form.lastName,
        };

        // Update localStorage with the updated user object
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Call the backend API to update the user in the database
        await updateUser(updatedUser);

        // Navigate to dashboard or other page after success
        navigate("/customerdashboard");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
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
          Complete Your Profile
        </Heading>
        <form onSubmit={handleSubmit(handleProfileCompletion)}>
          <Stack spacing={4}>
            {/* First Name Field */}
            <FormControl id="firstName" isInvalid={!!errors.firstName}>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter your first name"
                {...register("firstName")}
              />
              <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
            </FormControl>

            {/* Last Name Field */}
            <FormControl id="lastName" isInvalid={!!errors.lastName}>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter your last name"
                {...register("lastName")}
              />
              <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
            </FormControl>

            {/* Submit Button */}
            <Button
              colorScheme="teal"
              type="submit"
              size="lg"
              fontSize="md"
              width="full"
            >
              Complete Profile
            </Button>

            {/* Go Back Button */}
            {/* <Button
              variant="link"
              size="md"
              colorScheme="teal"
              onClick={() => navigate(-1)}
              mt={2}
            >
              Go Back
            </Button> */}
          </Stack>
        </form>

        {/* <Text mt={6} textAlign="center" fontSize="sm">
          Already completed?{" "}
          <Link color="teal.500" href="/dashboard">
            Go to Dashboard
          </Link>
        </Text> */}
      </Box>
    </Container>
  );
};

export default UserProfileCompletionPage;
