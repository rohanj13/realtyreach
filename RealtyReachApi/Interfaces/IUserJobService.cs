// IJobService.cs
using RealtyReachApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RealtyReachApi.Services
{
    public interface IUserJobService
    {
        Task<List<JobDto>> GetAllJobsForUser(Guid userId);
        Task<JobDto> GetJobById(int JobId);
        Task<bool> CreateJob(CreateJobDto createJobDto, Guid customerId);
        Task<bool> UpdateJob(int JobId, UpdateJobDto updateJobDto);
        Task<bool> DeleteJob(int JobId);
    }
}