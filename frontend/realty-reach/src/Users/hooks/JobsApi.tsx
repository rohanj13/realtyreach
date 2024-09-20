import axios from "axios";

// Define the base URL for the API (you can adjust this based on your backend URL)
const API_URL = "http://localhost:5073/api/jobs";

// Define interfaces for the DTOs
interface JobDto {
  jobId: number;
  title: string;
  description: string;
  // Add other relevant fields
}

interface CreateJobDto {
  title: string;
  description: string;
  // Add other relevant fields for creating a job
}

interface UpdateJobDto {
  title?: string;
  description?: string;
  // Add other fields that can be updated
}

// API to get all jobs for a specific user
export const getAllJobsForUser = async (userId: string): Promise<JobDto[]> => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs for user:", error);
    throw error;
  }
};

// API to get a job by job ID
export const getJobById = async (jobId: number): Promise<JobDto> => {
  try {
    const response = await axios.get(`${API_URL}/${jobId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    throw error;
  }
};

// API to create a new job
export const createJob = async (createJobDto: CreateJobDto): Promise<JobDto> => {
  try {
    const response = await axios.post(API_URL, createJobDto);
    return response.data;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

// API to update a job by job ID
export const updateJob = async (jobId: number, updateJobDto: UpdateJobDto): Promise<void> => {
  try {
    await axios.put(`${API_URL}/${jobId}`, updateJobDto);
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

// API to delete a job by job ID
export const deleteJob = async (jobId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${jobId}`);
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};
