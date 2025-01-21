import React, { FC } from "react";
import { Box, Flex, Text, Grid, Icon } from "@chakra-ui/react";
import { Briefcase, TrendingUp, Users, FileText } from "lucide-react";

const Metrics: FC = () => {
  const metrics = [
    {
      label: "Active Jobs",
      count: 3,
      description: "2 requiring action",
      icon: Briefcase,
      color: "blue.500",
    },
    {
      label: "New Quotes",
      count: 5,
      description: "Last 7 days",
      icon: TrendingUp,
      color: "green.500",
    },
    {
      label: "Connected Pros",
      count: 8,
      description: "Across all jobs",
      icon: Users,
      color: "purple.500",
    },
    {
      label: "Pending Docs",
      count: 4,
      description: "Need review",
      icon: FileText,
      color: "orange.500",
    },
  ];

  return (
    <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={8}>
      {metrics.map((metric, index) => (
        <Box key={index} p={6} bg="white" rounded="lg" shadow="base">
          <Flex justify="space-between" align="center" mb={4}>
            <Text color="gray.600">{metric.label}</Text>
            <Icon as={metric.icon} color={metric.color} />
          </Flex>
          <Text fontSize="2xl" fontWeight="bold">{metric.count}</Text>
          <Text fontSize="sm" color="gray.600" mt={1}>{metric.description}</Text>
        </Box>
      ))}
    </Grid>
  );
};

export default Metrics;