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

        public CustomerJobService(
            IProfessionalTypeRepository professionalTypeRepository, IJobMapper jobMapper,
            IMatchingService matchingService, IJobRepository jobRepository)
        {
            //_professionalTypeRepository = professionalTypeRepository;
            _jobRepository = jobRepository;
            _matchingService = matchingService;
            _jobMapper = jobMapper;
            _jobRepository = jobRepository;
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
                    await _matchingService.IdentifySuitableProfessionalsAsync(job);
                if (professionals.Any())
                {
                    Job jb = new Job
                    {
                        CustomerId = customerId,
                        JobTitle = createJobDto.JobTitle,
                        JobType = createJobDto.JobType,
                        AdditionalDetails = createJobDto.AdditionalDetails ?? string.Empty,
                        CreatedAt = DateTime.UtcNow,
                        Status = JobStatus.Open,
                        JobDetails = new JobDetail
                        {
                            //SuburbIds = createJobDto.SuburbIds,
                            Regions = createJobDto.Regions,
                            States = createJobDto.States,
                            Specialisations = createJobDto.Specialisations,
                            PurchaseType = createJobDto.PurchaseType ?? string.Empty,
                            PropertyType = createJobDto.PropertyType,
                            JourneyProgress = createJobDto.JourneyProgress,
                            SelectedProfessionals = createJobDto.SelectedProfessionals,
                            SuggestedProfessionalIds = professionals.Select(p => p.Id).ToArray(),
                            BudgetMin = createJobDto.BudgetMin,
                            BudgetMax = createJobDto.BudgetMax,
                            ContactEmail = createJobDto.ContactEmail,
                            ContactPhone = createJobDto.ContactPhone
                        }

                    };
                    await _jobRepository.CreateJobAsync(jb);
                }
                else
                {
                    throw new InvalidDataException("No Suitable Professionals Found");
                }
                return true;
            }
            catch (DbUpdateException)
            {
                return false;
            }
        }

        public async Task<bool> UpdateJob(UpdateJobDto updateJobDto)
        {
            // Validate input
            if (updateJobDto == null || updateJobDto.JobId <= 0)
            {
                return false;
            }

            // Retrieve existing job
            var existingJob = await _jobRepository.GetJobByIdAsync(updateJobDto.JobId);
            if (existingJob == null)
            {
                return false;
            }

            // Apply partial updates using mapper
            _jobMapper.ApplyUpdateToEntity(updateJobDto, existingJob);

            // Save updated job
            return await _jobRepository.UpdateJobAsync(existingJob);
        }

        public async Task<bool> DeleteJob(int jobId)
        {
            return await _jobRepository.DeleteJobAsync(jobId);
        }
    }
}