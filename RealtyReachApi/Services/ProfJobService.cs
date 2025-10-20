// ProfessionalService.cs
using Microsoft.EntityFrameworkCore;
using RealtyReachApi.Data;
using RealtyReachApi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using RealtyReachApi.Dtos;
using RealtyReachApi.Repositories;
using RealtyReachApi.Mappers;

namespace RealtyReachApi.Services
{
    public class ProfJobService(IJobRepository jobRepository, JourneyProgressOptions options, IJobMapper jobMapper) : IProfJobService
    {
        private readonly IJobRepository _jobRepository = jobRepository;
        private readonly JourneyProgressOptions _options = options;
        private readonly IJobMapper _jobMapper = jobMapper;

        public async Task<List<GetFinalisedJobDto>> GetFinalisedJobsForProfessionalAsync(Guid professionalId)
        {
            var links = await _jobRepository.GetFinalisedJobsForProfessionalAsync(professionalId);
            var jobs = links
                .Where(link => link.JobDetail?.Job != null)
                .Select(link => _jobMapper.ToGetFinalisedJobDto(link))
                .ToList();
            return jobs;
        }
    }
}
