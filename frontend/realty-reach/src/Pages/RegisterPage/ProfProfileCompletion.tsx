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
  Select,
  Stack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { updateProfessional } from "../../services/AuthService";
import { ProfessionalProfile, ProfessionalTypeEnum } from "../../Models/User";

// Define the types for form inputs
type ProfileCompletionInputs = {
  professionalType: string;
  firstName: string;
  lastName: string;
  ABN: string;
  LicenseNumber: string;
  CompanyName: string;
};

// Define validation schema using Yup
const validation = Yup.object().shape({
  professionalType: Yup.string().required("Please select a professional type"),
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  ABN: Yup.string().required("ABN is required"),
  LicenseNumber: Yup.string().required("License Number is required"),
  CompanyName: Yup.string().required("Company Name is required"),
});

const ProfProfileCompletionPage = () => {
  const navigate = useNavigate();

  // Use react-hook-form with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileCompletionInputs>({
    resolver: yupResolver(validation),
  });

  const professionalTypeMapping: Record<string, number> = {
    buyersAdvocate: ProfessionalTypeEnum.Advocate,
    mortgageBroker: ProfessionalTypeEnum.Broker,
    conveyancer: ProfessionalTypeEnum.Conveyancer,
    buildingInspector: ProfessionalTypeEnum.BuildAndPest,
  };


  // Handle form submission
  const handleProfileCompletion = async (form: ProfileCompletionInputs) => {
    try {
      // Retrieve the user object from localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userObj:ProfessionalProfile = JSON.parse(storedUser);
        const ProfessionalTypeId = professionalTypeMapping[form.professionalType];
        // Update the user object with new form details
        const updatedProfessional = {
          ...userObj,
          ProfessionalTypeId: ProfessionalTypeId,
          FirstName: form.firstName,
          LastName: form.lastName,
          ABN: form.ABN,
          LicenseNumber: form.LicenseNumber,
          CompanyName: form.CompanyName,
          FirstLogin: false,
        } as ProfessionalProfile;

        // Call the backend API to update the user in the database
        await updateProfessional(updatedProfessional);
        // Update localStorage with the updated user object
        localStorage.setItem("user", JSON.stringify(updatedProfessional));

        // Navigate to dashboard or other page after success
        navigate("/professionaldashboard");
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

            {/* ABN Field */}
            <FormControl id="ABN" isInvalid={!!errors.ABN}>
              <FormLabel>ABN</FormLabel>
              <Input
                type="text"
                placeholder="Enter your ABN"
                {...register("ABN")}
              />
              <FormErrorMessage>{errors.ABN?.message}</FormErrorMessage>
            </FormControl>

            {/* License Number Field */}
            <FormControl id="LicenseNumber" isInvalid={!!errors.LicenseNumber}>
              <FormLabel>License Number</FormLabel>
              <Input
                type="text"
                placeholder="Enter your License Number"
                {...register("LicenseNumber")}
              />
              <FormErrorMessage>{errors.LicenseNumber?.message}</FormErrorMessage>
            </FormControl>

            {/* Company Name Field */}
            <FormControl id="CompanyName" isInvalid={!!errors.CompanyName}>
              <FormLabel>Company Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter your Company Name"
                {...register("CompanyName")}
              />
              <FormErrorMessage>{errors.CompanyName?.message}</FormErrorMessage>
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
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

export default ProfProfileCompletionPage;
