import axios from "../axiosConfig";
import { CreateJobDto, Job, UpdateJobDto } from "../Models/Job";

// GET: Fetch all jobs for a customer by userId
export const getAllJobsForCustomer = async (userId: string): Promise<Job[]> => {
  try {
    const response = await axios.get<Job[]>(`/api/jobs/customer/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer jobs:', error);
    throw error;
  }
};

// GET: Fetch all available jobs for a professional
export const getAvailableJobsForProfessional = async (professionalId: string): Promise<Job[]> => {
  try {
    const response = await axios.get<Job[]>(`/api/jobs/professional/${professionalId}/availablejobs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching professional jobs:', error);
    throw error;
  }
};

// GET: Fetch jobs a professional has responded to
export const getRespondedJobsForProfessional = async (professionalId: string): Promise<Job[]> => {
  try {
    const response = await axios.get<Job[]>(`/api/jobs/professional/${professionalId}/respondedjobs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching responded jobs:', error);
    throw error;
  }
};

// GET: Fetch a job by its JobId
export const getJobById = async (jobId: string): Promise<Job> => {
  try {
    const response = await axios.get<Job>(`/api/jobs/customer/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job by id:', error);
    throw error;
  }
};

// POST: Create a new job
export const createJob = async (jobData: CreateJobDto): Promise<Job> => {
  try {
    const response = await axios.post<Job>('/api/jobs/customer', jobData);
    return response.data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

// PUT: Update an existing job
export const updateJob = async (jobData: UpdateJobDto): Promise<void> => {
  try {
    await axios.put(`/api/jobs/customer/${jobData.JobId}`, jobData);
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

// DELETE: Delete a job
export const deleteJob = async (jobId: string): Promise<void> => {
  try {
    await axios.delete(`/api/jobs/customer/${jobId}`);
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

// POST: Professional response to a job
export interface JobResponseDto {
  jobId: string;
  professionalId: string;
  message: string;
  price?: number;
}

export const respondToJob = async (responseData: JobResponseDto): Promise<void> => {
  try {
    await axios.post(`/api/jobs/professional/respond`, responseData);
  } catch (error) {
    console.error('Error responding to job:', error);
    throw error;
  }
};
