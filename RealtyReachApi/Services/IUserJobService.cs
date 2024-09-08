// IJobService.cs
using RealtyReachApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RealtyReachApi.Services
{
    public interface IUserJobService
    {
        Task<List<JobDto>> GetAllJobsForUser(int userId);
        Task<JobDto> GetJobById(int JobId);
        Task<JobDto> CreateJob(CreateJobDto createJobDto);
        Task<bool> UpdateJob(int JobId, UpdateJobDto updateJobDto);
        Task<bool> DeleteJob(int JobId);
    }
}