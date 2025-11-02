import backendApi from "@/axiosConfig";
import { Job } from "@/Models/Job";
import { Professional } from "@/Models/Professional";
import { UserProfile } from "@/Models/User";

// PUT: verify professional
export const verifyProfessional = async (userId: string): Promise<{ ProfessionalId: string; VerificationStatus: boolean }> => {
  try {
    const response = await backendApi.put(`/api/admin/professionals/${userId}/verify`);
    return response.data;
  } catch (error) {
    console.error('Error verifying professional:', error);
    throw error;
  }
};

export const rejectProfessional = async (userId: string): Promise<{ ProfessionalId: string; VerificationStatus: boolean }> => {
    try {
      const response = await backendApi.put(`/api/admin/professionals/${userId}/reject`);
      return response.data;
    } catch (error) {
      console.error('Error rejecting professional:', error);
      throw error;
    }
};

// GET: Fetch all jobs
export const getAllJobs = async (): Promise<Job[]> => {
  try {
    const response = await backendApi.get<Job[]>(`/api/admin/jobs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

// GET: Fetch all professionals
export const getAllProfessionals = async (): Promise<Professional[]> => {
  try {
    const response = await backendApi.get<Professional[]>(`/api/admin/professionals`);
    return response.data;
  } catch (error) {
    console.error('Error fetching professionals:', error);
    throw error;
  }

};

// GET: Fetch all customers
export const getAllCustomers = async (): Promise<UserProfile[]> => {
  try {
    const response = await backendApi.get<UserProfile[]>(`/api/admin/customers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};