using RealtyReachApi.Models;

namespace RealtyReachApi.Repositories;

public interface IJobRepository
{
    Task<Job?> GetJobByIdAsync(int jobId);
    Task<Job?> CreateJobAsync(Job? job);
    Task<JobDetailDto?> GetJobDetailWithProfessionalTypesAsync(int jobId);
}