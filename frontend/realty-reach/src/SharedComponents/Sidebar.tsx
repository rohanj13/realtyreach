import React from "react";
import { Box, VStack, Button, Icon, Heading } from "@chakra-ui/react";
import {
  Home,
  Briefcase,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import NavItem from "./NavItem"; // Adjust the path based on your file structure
import { useAuth } from "../Context/useAuth";

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  return (
    <Box w="64" bg="white" shadow="lg" position="relative">
      {/* Logo/Header */}
      <Box p={4}>
        <Heading size="lg" color="gray.800">
          RealtyReach
        </Heading>
      </Box>

      {/* Navigation Items */}
      <VStack spacing={2} align="stretch" mt={4} px={4}>
        <NavItem icon={Home} to="/dashboard" isActive={window.location.pathname === "/dashboard"}>
          Dashboard
        </NavItem>
        <NavItem icon={Briefcase} to="/my-jobs" isActive={window.location.pathname === "/my-jobs"}>
          My Jobs
        </NavItem>
        <NavItem icon={MessageSquare} to="/messages" isActive={window.location.pathname === "/messages"}>
          Messages
        </NavItem>
        <NavItem icon={Settings} to="/settings" isActive={window.location.pathname === "/settings"}>
          Settings
        </NavItem>
      </VStack>

      {/* Logout Button */}
      <Box position="absolute" bottom={0} w="full" p={4}>
        <Button
          leftIcon={<Icon as={LogOut} />}
          variant="ghost"
          w="full"
          justifyContent="flex-start"
          onClick={logout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
