import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  Avatar,
  Progress,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  List,
  ListItem,
  ListIcon,
  useDisclosure,
  ModalOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@chakra-ui/react';
import { 
  Home,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart2,
  MessageCircle,
} from 'lucide-react';
import CreateJobForm from '../../Components/CreateJobForm';
import Sidebar from "../../SharedComponents/Sidebar";
import { UserProfile } from '../../Models/User';

const CustomerDashboard = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [firstName, setFirstName] = useState<string>('');

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObj: UserProfile = JSON.parse(storedUser);
      setFirstName(userObj.FirstName);
    }
  }, []);
  return (
    <Flex direction="row" h="100vh">
        {/* <Sidebar /> */}
        <Box maxWidth="1200px" margin="auto" p={5}>
      <Flex direction="column" gap={6}>
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="lg">Welcome back, {firstName}!</Heading>
          <Button colorScheme="blue" leftIcon={<Home />} onClick={onOpen}>Create New Job</Button>
        </Flex>

        {/* Quick Stats */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
          <Stat>
            <StatLabel>Active Jobs</StatLabel>
            <StatNumber>2</StatNumber>
            <StatHelpText>
              <HStack>
                <Clock size={14} />
                <Text>Last updated 2 hours ago</Text>
              </HStack>
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Total Responses</StatLabel>
            <StatNumber>8</StatNumber>
            <StatHelpText>
              <HStack>
                <Users size={14} />
                <Text>From 5 professionals</Text>
              </HStack>
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Avg. Quote</StatLabel>
            <StatNumber>$2,500</StatNumber>
            <StatHelpText>
              <HStack>
                <DollarSign size={14} />
                <Text>For buyer's agent services</Text>
              </HStack>
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Main Content */}
        <Flex gap={6} direction={{ base: 'column', lg: 'row' }}>
          {/* Left Column: Active Jobs */}
          <VStack align="stretch" flex={1}>
            <Heading size="md">Your Active Jobs</Heading>
            <Card>
              <CardHeader>
                <Heading size="sm">Buying a House in Sydney</Heading>
                <Badge colorScheme="green">Active</Badge>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={3}>
                  <Text>Budget: $800,000 - $1,000,000</Text>
                  <Text>Property Type: House</Text>
                  <Text>Postcode: 2000</Text>
                  <Progress value={60} colorScheme="blue" />
                  <HStack justify="space-between">
                    <Text>4 New Responses</Text>
                    <Button size="sm" colorScheme="blue">View Details</Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <Heading size="sm">Selling an Apartment in Melbourne</Heading>
                <Badge colorScheme="yellow">Pending</Badge>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={3}>
                  <Text>Estimated Value: $500,000 - $550,000</Text>
                  <Text>Property Type: Apartment</Text>
                  <Text>Postcode: 3000</Text>
                  <Progress value={30} colorScheme="yellow" />
                  <HStack justify="space-between">
                    <Text>2 New Responses</Text>
                    <Button size="sm" colorScheme="blue">View Details</Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </VStack>

          {/* Right Column: Recent Activity and Tips */}
          <VStack align="stretch" flex={1}>
            <Heading size="md">Recent Activity</Heading>
            <Card>
              <CardBody>
                <List spacing={3}>
                  <ListItem>
                    <ListIcon as={MessageCircle} color="green.500" />
                    New message from John (Buyer's Agent)
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Quote received for property valuation
                  </ListItem>
                  <ListItem>
                    <ListIcon as={AlertCircle} color="red.500" />
                    Action required: Update budget preferences
                  </ListItem>
                </List>
              </CardBody>
            </Card>
            
            <Heading size="md" mt={4}>Tips for Your Journey</Heading>
            <Card>
              <CardBody>
                <VStack align="stretch" spacing={3}>
                  <Text>1. Consider getting pre-approved for a mortgage</Text>
                  <Text>2. Research the neighborhood thoroughly</Text>
                  <Text>3. Don't skip the home inspection</Text>
                  <Button size="sm" colorScheme="teal" variant="outline">
                    View More Tips
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Flex>

        {/* Professional Responses Section */}
        <Box>
          <Heading size="md" mb={4}>Recent Professional Responses</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Flex justify="space-between" align="center">
                    <Flex align="center" gap={3}>
                      <Avatar name={`Pro ${i}`} src={`https://i.pravatar.cc/150?img=${i}`} />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">John Doe</Text>
                        <Text fontSize="sm" color="gray.500">Buyer's Agent</Text>
                      </VStack>
                    </Flex>
                    <Badge colorScheme="green">Available</Badge>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Text noOfLines={2}>
                    "I've helped 50+ clients find their dream homes in Sydney. Let's discuss your preferences and budget to find the perfect match."
                  </Text>
                  <Divider my={3} />
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="bold">Quote: $2,000</Text>
                    <Button size="sm" colorScheme="blue">View Profile</Button>
                  </Flex>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
        {/* Create Job Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader><ModalCloseButton /></ModalHeader>
            <ModalBody>
              <CreateJobForm onClose={onClose}/>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    </Box>
    </Flex>
  );
};

export default CustomerDashboard;