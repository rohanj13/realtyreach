import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';

export const useFetchJobs = (userId: string) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    axios.get(`/api/jobs?userId=${userId}`)
      .then(response => {
        setJobs(response.data);
        setLoading(false);
      })
      .catch(error => {
        toast({
          title: 'Error fetching jobs',
          description: error.response?.data.message || "Failed to load jobs",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      });
  }, [userId, toast]);

  return { jobs, loading };
};

export const useCreateJob = () => {
  const toast = useToast();

  const createJob = (jobData: any, callback: (arg0: any) => void) => {
    axios.post(`/api/jobs`, jobData)
      .then(response => {
        toast({
          title: 'Job created successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        callback(response.data);
      })
      .catch(error => {
        toast({
          title: 'Error creating job',
          description: error.response?.data.message || "Failed to create job",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return createJob;
};
