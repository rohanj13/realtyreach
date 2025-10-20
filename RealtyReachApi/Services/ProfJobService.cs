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

namespace RealtyReachApi.Services
{
    public class ProfJobService(IJobRepository jobRepository, JourneyProgressOptions options) : IProfJobService
    {
        private readonly IJobRepository _jobRepository = jobRepository;
        private readonly JourneyProgressOptions _options = options;

        public async Task<List<JobDto>> GetApplicableJobsForProfessional(int professionalId)
        {
            //TODO: Retrieve from JobProfessionalLink table, to show matches
            throw new NotImplementedException();
        }
        public async Task<List<GetFinalisedJobDto>> GetFinalisedJobsForProfessionalAsync(Guid professionalId)
        {
            var links = await _jobRepository.GetFinalisedJobsForProfessionalAsync(professionalId);
            var jobs = links
                .Where(link => link.JobDetail?.Job != null)
                .Select(link => new GetFinalisedJobDto
                {
                    JobId = link.JobDetail.Job.JobId,
                    Title = link.JobDetail.Job.JobTitle,
                    JobType = link.JobDetail.Job.JobType,
                    Status = link.JobDetail.Job.Status.ToString(),
                    Region = link.JobDetail.Regions?.FirstOrDefault() ?? string.Empty,
                    State = link.JobDetail.States != null && link.JobDetail.States.Count > 0 ? link.JobDetail.States[0].ToString() : string.Empty,
                    Specialisation = link.JobDetail.Specialisations != null && link.JobDetail.Specialisations.Count > 0 ? link.JobDetail.Specialisations[0].ToString() : string.Empty,
                    PurchaseType = link.JobDetail.PurchaseType ?? string.Empty,
                    PropertyType = link.JobDetail.PropertyType ?? string.Empty,
                    CustomerEmail = link.JobDetail.ContactEmail ?? string.Empty,
                    CustomerPhone = link.JobDetail.ContactPhone ?? string.Empty,
                    AssignedDate = link.AssignedDate
                })
                .ToList();
            return jobs;
        }
    }
}
