import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Card,
  CardHeader,
  CardBody,
  Button,
  Badge,
  VStack,
  HStack,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { FaBriefcase, FaCheckCircle, FaBell, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

// Define interfaces for our data structures
interface AvailableJob {
  id: number;
  title: string;
  location: string;
  budget: string;
  postedDate: string;
}

interface RespondedJob {
  id: number;
  title: string;
  location: string;
  status: 'Pending' | 'Accepted';
  respondedDate: string;
}

// Mock data for demonstration
const availableJobs: AvailableJob[] = [
  { id: 1, title: 'Buyer Agent Needed', location: 'Sydney', budget: '$500k-$700k', postedDate: '2024-10-15' },
  { id: 2, title: 'Mortgage Broker Required', location: 'Melbourne', budget: '$300k-$500k', postedDate: '2024-10-14' },
  // Add more jobs as needed
];

const respondedJobs: RespondedJob[] = [
  { id: 3, title: 'Home Valuation', location: 'Brisbane', status: 'Pending', respondedDate: '2024-10-13' },
  { id: 4, title: 'First-Time Buyer Assistance', location: 'Perth', status: 'Accepted', respondedDate: '2024-10-12' },
  // Add more jobs as needed
];

interface StatCardProps {
  title: string;
  stat: number | string;
  icon: React.ReactElement;
}

const StatCard: React.FC<StatCardProps> = ({ title, stat, icon }) => {
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={'5'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={useColorModeValue('gray.800', 'gray.500')}
      rounded={'lg'}
    >
      <Flex justifyContent={'space-between'}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={'medium'} isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            {stat}
          </StatNumber>
        </Box>
        <Box
          my={'auto'}
          color={useColorModeValue('gray.800', 'gray.200')}
          alignContent={'center'}
        >
          {icon}
        </Box>
      </Flex>
    </Stat>
  );
};

interface JobCardProps {
  job: AvailableJob | RespondedJob;
  isResponded?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, isResponded = false }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'white');

  return (
    <Card bg={cardBg} boxShadow="md" borderRadius="lg">
      <CardHeader>
        <Heading size="md" color={textColor}>{job.title}</Heading>
        <HStack mt={2}>
          <Icon as={FaMapMarkerAlt} color="gray.500" />
          <Text color="gray.500">{job.location}</Text>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack align="start" spacing={2}>
          {!isResponded ? (
            <>
              <Text><strong>Budget:</strong> {(job as AvailableJob).budget}</Text>
              <Text><strong>Posted:</strong> {(job as AvailableJob).postedDate}</Text>
              <Button colorScheme="blue" mt={4}>Respond to Job</Button>
            </>
          ) : (
            <>
              <HStack>
                <Text><strong>Status:</strong></Text>
                <Badge colorScheme={(job as RespondedJob).status === 'Accepted' ? 'green' : 'yellow'}>
                  {(job as RespondedJob).status}
                </Badge>
              </HStack>
              <Text><strong>Responded:</strong> {(job as RespondedJob).respondedDate}</Text>
              <Button colorScheme="teal" variant="outline" mt={4}>View Details</Button>
            </>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

const ProfessionalDashboard: React.FC = () => {
  return (
    <Box maxWidth="1200px" margin="auto" p={5}>
      <Heading as="h1" size="xl" mb={6}>Professional Dashboard</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={10}>
        <StatCard title="Total Available Jobs" stat={availableJobs.length} icon={<Icon as={FaBriefcase} w={8} h={8} />} />
        <StatCard title="Responded Jobs" stat={respondedJobs.length} icon={<Icon as={FaCheckCircle} w={8} h={8} />} />
        <StatCard 
          title="Accepted Proposals" 
          stat={respondedJobs.filter(job => job.status === 'Accepted').length} 
          icon={<Icon as={FaBell} w={8} h={8} />} 
        />
        <StatCard 
          title="Pending Proposals" 
          stat={respondedJobs.filter(job => job.status === 'Pending').length} 
          icon={<Icon as={FaClock} w={8} h={8} />} 
        />
      </SimpleGrid>

      <VStack spacing={10} align="stretch">
        <Box>
          <Heading as="h2" size="lg" mb={4}>Available Jobs</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
            {availableJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </SimpleGrid>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>Responded Jobs</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
            {respondedJobs.map(job => (
              <JobCard key={job.id} job={job} isResponded={true} />
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );
};

export default ProfessionalDashboard;