import { FinalisedJob } from "../Models/FinalisedJob";
import backendApi from "@/axiosConfig";
import { CreateJobDto, JobDto, UpdateJobDto, MatchingJobDto } from "../Models/Job";
import { MatchedProfessional, ProfessionalProfile } from "../Models/Professional";


// GET: Fetch finalised jobs for a professional (high quality leads)
export const getFinalisedJobsForProfessional = async (): Promise<FinalisedJob[]> => {
  try {
    const response = await backendApi.get<FinalisedJob[]>(`/api/jobs/professional/finalised`);
    return response.data;
  } catch (error) {
    console.error('Error fetching finalised jobs:', error);
    throw error;
  }
};

// GET: Fetch all jobs for a customer by userId
export const getAllJobsForCustomer = async (userId: string): Promise<JobDto[]> => {
  try {
    const response = await backendApi.get<JobDto[]>(`/api/jobs/customer/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer jobs:', error);
    throw error;
  }
};

// GET: Fetch a job by its JobId
export const getJobById = async (jobId: number): Promise<JobDto> => {
  try {
    const response = await backendApi.get<JobDto>(`/api/jobs/customer/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job by id:', error);
    throw error;
  }
};

// POST: Create a new job
export const createJob = async (jobData: CreateJobDto): Promise<JobDto> => {
  try {
    const response = await backendApi.post<JobDto>('/api/jobs/customer', jobData);
    return response.data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

// PUT: Update an existing job
export const updateJob = async (jobData: UpdateJobDto): Promise<void> => {
  try {
    await backendApi.put(`/api/jobs/customer/${jobData.jobId}`, jobData);
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

// DELETE: Delete a job
export const deleteJob = async (jobId: number): Promise<void> => {
  try {
    await backendApi.delete(`/api/jobs/customer/${jobId}`);
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

// POST: Professional response to a job
export interface JobResponseDto {
  jobId: number;
  professionalId: number;
  message: string;
  price?: number;
}

export const respondToJob = async (responseData: JobResponseDto): Promise<void> => {
  try {
    await backendApi.post(`/api/jobs/professional/respond`, responseData);
  } catch (error) {
    console.error('Error responding to job:', error);
    throw error;
  }
};

// GET: Get matched professionals for a job
export const getMatchedProfessionals = async (jobId: number): Promise<MatchedProfessional[]> => {
  try {
    const response = await backendApi.get<MatchedProfessional[]>(`/api/jobs/customer/${jobId}/matches`);
    return response.data;
  } catch (error) {
    console.error('Error fetching matched professionals:', error);
    throw error;
  }
};

// GET: Get professional profile
export const getProfessionalProfile = async (professionalId: string): Promise<ProfessionalProfile> => {
  try {
    const response = await backendApi.get<ProfessionalProfile>(`/api/professional/${professionalId}/profile`);
    return response.data;
  } catch (error) {
    console.error('Error fetching professional profile:', error);
    throw error;
  }
};

// POST: Finalize match between customer and professional
export const finalizeMatch = async (matchingData: MatchingJobDto): Promise<void> => {
  try {
    await backendApi.post('/api/jobs/customer/finalise', matchingData);
  } catch (error) {
    console.error('Error finalizing match:', error);
    throw error;
  }
};
