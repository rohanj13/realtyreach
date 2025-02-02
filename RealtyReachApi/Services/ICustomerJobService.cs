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
        Task<bool> CreateJobAsync(CreateJobDto createJobDto, Guid customerId);
        // Task<bool> UpdateJob(UpdateJobDto updateJobDto);
        Task<bool> DeleteJob(int JobId);
    }
}