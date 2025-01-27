import React, { FC } from "react";
import { Box, Heading, Table, Thead, Tr, Th, Tbody, Td, Badge, Button, Flex } from "@chakra-ui/react";
import Sidebar from "../../SharedComponents/Sidebar";

const jobsData = [
  {
    property: "123 Richmond St",
    type: "Purchase",
    status: { label: "Quotes Pending", colorScheme: "yellow" },
    created: "Dec 15, 2024",
    lastActivity: "2 hours ago",
  },
  // Other jobs...
];

const MyJobs: FC = () => {
  return (
    <Flex h="100vh" bg="gray.100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box flex={1} overflowY="auto" p={6}>
        <Box bg="white" rounded="lg" shadow="base" p={6}>
          <Heading size="md" mb={4}>
            All Property Jobs
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Property</Th>
                <Th>Type</Th>
                <Th>Status</Th>
                <Th>Created</Th>
                <Th>Last Activity</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {jobsData.map((job, index) => (
                <Tr key={index}>
                  <Td>{job.property}</Td>
                  <Td>{job.type}</Td>
                  <Td>
                    <Badge colorScheme={job.status.colorScheme}>
                      {job.status.label}
                    </Badge>
                  </Td>
                  <Td>{job.created}</Td>
                  <Td>{job.lastActivity}</Td>
                  <Td>
                    <Button variant="link" colorScheme="blue">
                      View Details
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Flex>
  );
};

export default MyJobs;