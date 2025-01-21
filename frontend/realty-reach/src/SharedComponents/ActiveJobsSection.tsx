import React, { FC } from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  Button,
  Flex,
  Badge,
  VStack,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { Clock, AlertCircle, FileText, LucideIcon } from 'lucide-react';

interface JobStatus {
  label: string;
  colorScheme: string;
}

interface JobInfo {
  id: string;
  address: string;
  type: string;
  status: JobStatus;
  createdDate: string;
  alerts: {
    icon: LucideIcon;
    message: string;
  }[];
}

interface JobCardProps {
  job: JobInfo;
  onViewDetails: (jobId: string) => void;
}

const JobCard: FC<JobCardProps> = ({ job, onViewDetails }) => (
  <Box bg="white" rounded="lg" shadow="base" p={6}>
    <Flex justify="space-between" align="flex-start" mb={4}>
      <Box>
        <Heading size="md" mb={1}>{job.address}</Heading>
        <Text color="gray.600">{job.type}</Text>
      </Box>
      <Badge
        px={3}
        py={1}
        rounded="full"
        colorScheme={job.status.colorScheme}
      >
        {job.status.label}
      </Badge>
    </Flex>

    <VStack spacing={3} align="stretch" mb={4}>
      {job.alerts.map((alert, index) => (
        <HStack key={index} spacing={2} color="gray.600" fontSize="sm">
          <Icon as={alert.icon} boxSize={4} />
          <Text>{alert.message}</Text>
        </HStack>
      ))}
    </VStack>

    <Button
      w="full"
      variant="outline"
      colorScheme="blue"
      onClick={() => onViewDetails(job.id)}
    >
      View Job Details
    </Button>
  </Box>
);

const ActiveJobsSection: FC = () => {
  const jobs: JobInfo[] = [
    {
      id: '1',
      address: '123 Richmond St, Richmond',
      type: 'Property Purchase',
      status: {
        label: '4 New Quotes',
        colorScheme: 'yellow',
      },
      createdDate: 'Dec 15, 2024',
      alerts: [
        {
          icon: Clock,
          message: 'Created: Dec 15, 2024'
        },
        {
          icon: AlertCircle,
          message: '3 professionals awaiting response'
        }
      ]
    },
    {
      id: '2',
      address: '45 Brunswick Rd, Brunswick',
      type: 'Property Sale',
      status: {
        label: 'In Progress',
        colorScheme: 'green',
      },
      createdDate: 'Nov 28, 2024',
      alerts: [
        {
          icon: Clock,
          message: 'Created: Nov 28, 2024'
        },
        {
          icon: FileText,
          message: '2 documents need review'
        }
      ]
    }
  ];

  const handleViewDetails = (jobId: string) => {
    console.log(`Viewing details for job ${jobId}`);
    // Add your navigation logic here
  };

  return (
    <Box mb={8}>
      <Heading size="md" mb={4}>Active Property Jobs</Heading>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onViewDetails={handleViewDetails}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default ActiveJobsSection;