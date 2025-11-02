using RealtyReachApi.Models;

namespace RealtyReachApi.Repositories;

public interface IJobRepository
{
    Task<Job?> GetJobByIdAsync(int jobId);
    Task<List<Job>> GetAllJobsforCustomerAsync(Guid customerId);
    Task<List<Job>> GetAllJobsAsync();
    Task<Job?> CreateJobAsync(Job? job);
    // Task<JobDetail?> GetJobDetailWithProfessionalTypesAsync(int jobId);
    Task<bool> UpdateJobAsync(Job? job);
    Task<bool> DeleteJobAsync(int jobId);
    Task<JobProfessionalLink> MatchJobAsync(JobProfessionalLink jobProfessionalLink);
    Task<List<JobProfessionalLink>> GetFinalisedJobsForProfessionalAsync(Guid professionalId);
}