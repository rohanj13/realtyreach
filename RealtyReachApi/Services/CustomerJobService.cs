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
        private readonly IProfessionalMapper _professionalMapper;
        private readonly IProfessionalRepository _professionalRepository;

        public CustomerJobService
        (
            IProfessionalTypeRepository professionalTypeRepository, IJobMapper jobMapper,
            IMatchingService matchingService, IJobRepository jobRepository, IProfessionalMapper professionalMapper,
            IProfessionalRepository professionalRepository)
        {
            //_professionalTypeRepository = professionalTypeRepository;
            _jobRepository = jobRepository;
            _matchingService = matchingService;
            _jobMapper = jobMapper;
            _jobRepository = jobRepository;
            _professionalMapper = professionalMapper;
            _professionalRepository = professionalRepository;
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

        public async Task<JobMatchesDto> GetJobMatchesAsync(int jobId)
        {
            var job = await _jobRepository.GetJobByIdAsync(jobId);
            if (job == null || job.JobDetails == null) return null;

            var jobInfoDto = _jobMapper.ToJobInfoDto(job);

            // Get suggested professionals (by ID) using repository
            var suggestedIds = job.JobDetails.SuggestedProfessionalIds ?? Array.Empty<Guid>();
            var suggestedProfessionals = new List<ProfessionalDto>();
            if (suggestedIds.Length > 0)
            {
                foreach (var suggestedId in suggestedIds)
                {
                    var professional = await _professionalRepository.GetProfessionalByIdAsync(suggestedId);
                    suggestedProfessionals.Add(_professionalMapper.ToProfessionalDto(professional));
                }
            }

            // Get finalised professionals from JobProfessionalLink using repository
            var finalisedProfessionals = new List<ProfessionalDto>();
            var finalisedIds = await _jobRepository.GetFinalisedProfessionalLinksByJobDetailIdAsync(job.JobDetails.JobDetailId);
            if (finalisedIds.Count > 0)
            {
                foreach (Guid id in finalisedIds)
                {
                    var professional = await _professionalRepository.GetProfessionalByIdAsync(id);
                    finalisedProfessionals.Add(_professionalMapper.ToProfessionalDto(professional));
                }
            }

            return new JobMatchesDto
            {
                Job = jobInfoDto,
                SuggestedProfessionals = suggestedProfessionals,
                FinalisedProfessionals = finalisedProfessionals
            };
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
                    job.JobDetails!.SuggestedProfessionalIds = professionals.Select(p => p.Id).ToArray();
                    await _jobRepository.CreateJobAsync(job);
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