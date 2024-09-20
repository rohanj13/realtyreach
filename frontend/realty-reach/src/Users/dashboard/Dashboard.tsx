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
import { ChevronRightIcon } from "@chakra-ui/icons";
import axios from "axios";
import Sidebar from "../../SharedComponents/Sidebar"; // Import the Sidebar component
import JobModal from "./CreateJobForm";
import { useAuth0 } from "@auth0/auth0-react";

interface Job {
  id: number;
  title: string;
  details: string;
  professional: string;
  responses: string[];
}

const Dashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobDetails, setNewJobDetails] = useState("");
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { user } = useAuth0();
  

  // Fetch jobs for the user
  useEffect(() => {
    const userId = user?.sub;
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

  // Handle job creation
  const handleCreateJob = (jobDetails: any) => {
    axios
      .post(`/api/jobs`, jobDetails)
      .then((response) => {
        setJobs([...jobs, response.data]);
        toast({
          title: "Job created successfully.",
          status: "success",
          isClosable: true,
        });
        onClose();
      })
      .catch((error) => {
        toast({
          title: "Error creating job.",
          status: "error",
          isClosable: true,
        });
      });
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
        <Flex justify="space-between" align="center">
          <Heading size="md">My Jobs</Heading>
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
                key={job.id}
                variant={selectedJob?.id === job.id ? "solid" : "outline"}
                colorScheme={selectedJob?.id === job.id ? "blue" : "gray"}
                onClick={() => handleJobSelect(job)}
              >
                {job.title}
              </Button>
            ))}
          </VStack>

          {/* Right Side - Job Details */}
          <Box flex={1} p={4} ml={4} bg="white" borderRadius="md" boxShadow="md">
            {selectedJob ? (
              <>
                <HStack mb={4}>
                  <Avatar size="lg" name={selectedJob.professional} />
                  <VStack align="start">
                    <Heading size="md">{selectedJob.title}</Heading>
                    <Text>{selectedJob.details}</Text>
                  </VStack>
                </HStack>

                <Divider />

                <VStack align="start" spacing={4} mt={4}>
                  <Box w="100%">
                    <Heading size="sm">Responses</Heading>
                    {selectedJob.responses.length > 0 ? (
                      selectedJob.responses.map((response, index) => (
                        <Text key={index}>{response}</Text>
                      ))
                    ) : (
                      <Text>No responses yet.</Text>
                    )}
                  </Box>
                </VStack>
              </>
            ) : (
              <Text>Select a job to view details</Text>
            )}
          </Box>
        </Flex>
      </Flex>
      <JobModal isOpen={isOpen} onClose={onClose} onSubmit={handleCreateJob} />
    </Flex>
  );
};

export default Dashboard;
