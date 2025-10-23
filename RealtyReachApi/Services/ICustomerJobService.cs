// IJobService.cs
using RealtyReachApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using RealtyReachApi.Dtos;

namespace RealtyReachApi.Services
{
    public interface ICustomerJobService
    {
        Task<List<JobDto>> GetAllJobsForCustomerAsync(Guid userId);
        Task<JobDto> GetJobByIdAsync(int JobId);
        Task<JobMatchesDto> GetJobMatchesAsync(int jobId);
        Task<bool> CreateJobAsync(CreateJobDto createJobDto, Guid customerId);
        Task<bool> UpdateJob(JobDto updateJobDto);
        Task<bool> DeleteJob(int JobId);
    }
}