import React, { useState } from "react";
import { Box, FormControl, FormLabel, Input, Button, useToast } from "@chakra-ui/react";
import { updateUser } from "./userApi"; // Import the updateUser function from userApi

interface UserFormProps {
  userId: string; // Assuming userId is passed down as a prop
}

const UserForm: React.FC<UserFormProps> = ({ userId }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const toast = useToast(); // Using Chakra UI's toast for notifications

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create the updateUserDto object
    const updateUserDto = {
      firstName,
      lastName,
      phoneNo,
    };

    try {
      // Call the updateUser function from userApi
      await updateUser(userId, updateUserDto);

      toast({
        title: "User updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Failed to update user.",
        description: "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} width="400px" mx="auto" mt="20px">
      <FormControl id="firstName" isRequired>
        <FormLabel>First Name</FormLabel>
        <Input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter your first name"
        />
      </FormControl>

      <FormControl id="lastName" mt={4} isRequired>
        <FormLabel>Last Name</FormLabel>
        <Input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter your last name"
        />
      </FormControl>

      <FormControl id="phoneNo" mt={4}>
        <FormLabel>Phone Number</FormLabel>
        <Input
          type="tel"
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
          placeholder="Enter your phone number"
        />
      </FormControl>

      <Button mt={6} colorScheme="teal" type="submit">
        Update Details
      </Button>
    </Box>
  );
};

export default UserForm;
