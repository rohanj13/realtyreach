// IJobService.cs
using RealtyReachApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using RealtyReachApi.Dtos;

namespace RealtyReachApi.Services
{
    public interface ICustomerJobService
    {
        Task<List<JobDto>> GetAllJobsForCustomer(Guid userId);
        Task<JobDto> GetJobById(int JobId);
        Task<JobDto> CreateJobAsync(CreateJobDto createJobDto);
        Task<bool> UpdateJob(int JobId, UpdateJobDto updateJobDto);
        Task<bool> DeleteJob(int JobId);
    }
}