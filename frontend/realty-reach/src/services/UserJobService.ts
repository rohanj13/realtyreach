import axios from 'axios';
import { CreateJobDto, Job, UpdateJobDto } from '../Models/Job';

const API_URL = "http://localhost:5073/api/jobs"; // The base URL for the Jobs API

// GET: Fetch all jobs for a user by userId
export const getAllJobsForUser = async (userId: number): Promise<Job[]> => {
    try {
        const response = await axios.get<Job[]>(`${API_URL}/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching jobs for user:', error);
        throw error;
    }
};

// GET: Fetch a job by its JobId
export const getJobById = async (jobId: number): Promise<Job> => {
    try {
        const response = await axios.get<Job>(`${API_URL}/${jobId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching job by id:', error);
        throw error;
    }
};

// POST: Create a new job
export const createJob = async (createJobDto: CreateJobDto): Promise<Job> => {
    try {
        const response = await axios.post(API_URL, createJobDto);
        return response.data;
    } catch (error) {
        console.error('Error creating job:', error);
        throw error;
    }
};

// PUT: Update a job by its JobId
export const updateJob = async (jobId: number, updateJobDto: UpdateJobDto): Promise<void> => {
    try {
        await axios.put(`${API_URL}/${jobId}`, updateJobDto);
    } catch (error) {
        console.error('Error updating job:', error);
        throw error;
    }
};

// DELETE: Delete a job by its JobId
export const deleteJob = async (jobId: number): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${jobId}`);
    } catch (error) {
        console.error('Error deleting job:', error);
        throw error;
    }
};
