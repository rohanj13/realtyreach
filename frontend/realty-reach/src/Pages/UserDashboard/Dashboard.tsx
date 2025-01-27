import {
  Box,
  Flex,
  VStack,
  HStack,
  Avatar,
  Heading,
  Text,
  Button,
  Divider,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  useDisclosure,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../SharedComponents/Sidebar"; // Import the Sidebar component
import { Job } from "../../Models/Job";
import CreateJobForm from "../../Components/CreateJobForm";// Import the CreateJobForm component

const Dashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null); // State to store the logged-in user's email
  const toast = useToast();

  // Fetch the logged-in user's email from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserEmail(user.email); // Set the email from the stored user object
    }
  }, []);

  // Fetch jobs for the user
  useEffect(() => {
    const userId = 0; // Replace with actual userId
    axios
      .get(`/api/jobs?userId=${userId}`)
      .then((response) => {
        setJobs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        toast({
          title: "Error fetching jobs.",
          status: "error",
          isClosable: true,
        });
        setLoading(false);
      });
  }, []);

  // Handle job selection
  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex direction="row" h="100vh">
      <Sidebar /> {/* Render the sidebar */}
      <Flex direction="column" p={5} bg="gray.100" flex="1">
        {/* Show logged-in user's email at the top */}
        <Flex justify="space-between" align="center">
          {userEmail && (
            <Text fontSize="md" color="black.600">
              Logged in as: {userEmail}
            </Text>
          )}
        </Flex>

        <Divider my={4} />

        <Flex justify="space-between" align="center">
          <Heading size="md">My Jobs</Heading>
          {/* Open the Create Job Form modal when clicking the button */}
          <Button colorScheme="blue" onClick={onOpen}>
            New Job
          </Button>
        </Flex>

        <Flex mt={5} h="100%" w="100%">
          {/* Left Side - Jobs List */}
          <VStack
            spacing={4}
            w="30%"
            align="stretch"
            bg="white"
            p={4}
            borderRadius="md"
            boxShadow="md"
          >
            {jobs.map((job) => (
              <Button
                key={job.jobId}
                variant={selectedJob?.jobId === job.jobId ? "solid" : "outline"}
                colorScheme={selectedJob?.jobId === job.jobId ? "blue" : "gray"}
                onClick={() => handleJobSelect(job)}
              >
                {job.JobType}
              </Button>
            ))}
          </VStack>

          {/* Right Side - Job Details */}
          <Box flex={1} p={4} ml={4} bg="white" borderRadius="md" boxShadow="md">
            {selectedJob ? (
              <>

                <Divider />
              </>
            ) : (
              <Text>Select a job to view details</Text>
            )}
          </Box>
        </Flex>

        {/* Create Job Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Job</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <CreateJobForm onClose={onClose}/>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </Flex>
  );
};

export default Dashboard;
