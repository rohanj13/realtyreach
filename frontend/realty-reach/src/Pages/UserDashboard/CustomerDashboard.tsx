import React, { FC, useEffect, useState } from "react";
import { Flex, Box, Heading, Text, Button, HStack, Icon } from "@chakra-ui/react";
import { PlusCircle, Bell } from "lucide-react";
import ActiveJobsSection from "../../SharedComponents/ActiveJobsSection";
import Sidebar from "../../SharedComponents/Sidebar";
import Metrics from "../../Components/Metrics";
import NotificationsDrawer from "../../Components/NotificationsDrawer";

import { UserProfile } from "../../Models/User";
import CreateJobModal from "../../SharedComponents/CreateJobModal";

const CustomerDashboard: FC = () => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
    const [firstName, setFirstName] = useState<string>("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const userObj: UserProfile = JSON.parse(storedUser);
            setFirstName(userObj.FirstName);
        }
    }, []);

    return (
        <Flex h="100vh" bg="gray.100">
            <Sidebar />

            <Box flex={1} overflowY="auto">
                <Box bg="white" shadow="sm">
                    <Flex justify="space-between" align="center" px={8} py={4}>
                        <Heading size="lg">Dashboard</Heading>
                        <HStack spacing={4}>
                            <Box position="relative">
                                <Button
                                    variant="ghost"
                                    p={2}
                                    onClick={() => setIsNotificationsOpen(true)}
                                >
                                    <Icon as={Bell} />
                                </Button>
                                <Box
                                    position="absolute"
                                    top={0}
                                    right={0}
                                    w={2}
                                    h={2}
                                    bg="red.500"
                                    rounded="full"
                                />
                            </Box>
                            <Text fontSize="sm" color="gray.600">
                                Welcome, {firstName}
                            </Text>
                        </HStack>
                    </Flex>
                </Box>

                <Box p={8}>
                    <Box mb={8}>
                        <Button
                            leftIcon={<Icon as={PlusCircle} />}
                            colorScheme="blue"
                            size="lg"
                            onClick={() => setIsCreateJobModalOpen(true)}
                        >
                            Create New Job
                        </Button>
                    </Box>

                    <Metrics />
                    <ActiveJobsSection />
                </Box>
            </Box>

            <NotificationsDrawer
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
            />
            <CreateJobModal
                isOpen={isCreateJobModalOpen}
                onClose={() => setIsCreateJobModalOpen(false)}
            />
        </Flex>
    );
};

export default CustomerDashboard;