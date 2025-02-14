// JobService.cs
using Microsoft.EntityFrameworkCore;
using RealtyReachApi.Data;
using RealtyReachApi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RealtyReachApi.Dtos;
using RealtyReachApi.Mappers;
using RealtyReachApi.Repositories;

namespace RealtyReachApi.Services
{
    public class CustomerJobService : ICustomerJobService
    {
        //private readonly IProfessionalTypeRepository _professionalTypeRepository;
        private readonly IJobRepository _jobRepository;
        private readonly IMatchingService _matchingService;
        private readonly IJobMapper _jobMapper;

        public CustomerJobService(IJobMapper jobMapper, 
            IMatchingService matchingService, IJobRepository jobRepository)
        {
            //_professionalTypeRepository = professionalTypeRepository;
            _jobRepository = jobRepository;
            _matchingService = matchingService;
            _jobMapper = jobMapper;
        }

        public async Task<List<JobDto>> GetAllJobsForCustomerAsync(Guid userId)
        {
            // Get from repository
            var jobs = await _jobRepository.GetAllJobsforCustomerAsync(userId);
            List<JobDto> jobDtos = new List<JobDto>();
            foreach (var j in jobs)
            {
                jobDtos.Add(_jobMapper.ToJobDto(j));
            }
            return jobDtos;
        }

        public async Task<JobDto> GetJobByIdAsync(int jobId)
        {
            // Get from repository
            var job = await _jobRepository.GetJobByIdAsync(jobId);
            if (job == null) return null;
            return _jobMapper.ToJobDto(job);
        }

        public async Task<bool> CreateJobAsync(CreateJobDto createJobDto, Guid customerId)
        {
            Job job = _jobMapper.ToJobEntity(createJobDto, customerId);
            try
            {
                //TODO: Call matching service function IdentifySuitableProfessionalsAsync(int jobId)
                List<Professional> professionals =
                    await _matchingService.IdentifySuitableProfessionalsAsync(createJobDto.SelectedProfessionals);
                
                return true;
            }
            catch (DbUpdateException)
            {
                return false;
            }
        }

        public async Task<bool> UpdateJob(JobDto updateJobDto)
        {
            Job job = _jobMapper.ToJobEntity(updateJobDto);
            return await _jobRepository.UpdateJobAsync(job);
        }

        public async Task<bool> DeleteJob(int jobId)
        {
            return await _jobRepository.DeleteJobAsync(jobId);
        }
    }
}
