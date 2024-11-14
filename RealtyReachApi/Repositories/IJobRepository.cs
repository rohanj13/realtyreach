using RealtyReachApi.Models;

namespace RealtyReachApi.Repositories;

public interface IJobRepository
{
    Task<Job> GetJobByIdAsync(int jobId);
    Task AddJobAsync(Job job, List<int> professionalTypeIds);
    Task<JobDetailDto?> GetJobDetailWithProfessionalTypesAsync(int jobId);
}