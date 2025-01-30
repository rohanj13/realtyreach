// JobService.cs
using Microsoft.EntityFrameworkCore;
using RealtyReachApi.Data;
using RealtyReachApi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RealtyReachApi.Dtos;
using RealtyReachApi.Repositories;

namespace RealtyReachApi.Services
{
    public class CustomerJobService : ICustomerJobService
    {
        private readonly IProfessionalTypeRepository _professionalTypeRepository;

        public CustomerJobService(IProfessionalTypeRepository professionalTypeRepository)
        {
            _professionalTypeRepository = professionalTypeRepository;
        }

        public async Task<List<JobDto>> GetAllJobsForCustomer(Guid userId)
        {
            // Get from repository
            return await _context.Jobs
                .Include(r => r.JobDetails)
                .Where(r => r.CustomerId == userId)
                .Select(r => new JobDto
                {
                    JobId = r.JobId,
                    UserId = r.CustomerId,
                    JobType = r.JobType,
                    JobTitle = r.JobTitle,
                    AdditionalDetails = r.AdditionalDetails,
                    Status = r.Status.ToString(),
                    Postcode = r.JobDetails.Postcode,
                    PurchaseType = r.JobDetails.PurchaseType,
                    PropertyType = r.JobDetails.PropertyType,
                    JourneyProgress = r.JobDetails.JourneyProgress,
                    SelectedProfessionals = r.JobDetails.SelectedProfessionals,
                    BudgetMin = r.JobDetails.BudgetMin,
                    BudgetMax = r.JobDetails.BudgetMax,
                    ContactEmail = r.JobDetails.ContactEmail,
                    ContactPhone = r.JobDetails.ContactPhone

                })
                .ToListAsync();
        }

        public async Task<JobDto> GetJobById(int JobId)
        {
            // Get from repository
            return await _context.Jobs
                .Include(r => r.JobDetails)
                .Where(r => r.JobId == JobId)
                .Select(r => new JobDto
                {
                    JobType = r.JobType,
                    JobTitle = r.JobTitle,
                    AdditionalDetails = r.AdditionalDetails,
                    Status = r.Status.ToString(),
                    Postcode = r.JobDetails.Postcode,
                    PurchaseType = r.JobDetails.PurchaseType,
                    PropertyType = r.JobDetails.PropertyType,
                    JourneyProgress = r.JobDetails.JourneyProgress,
                    SelectedProfessionals = r.JobDetails.SelectedProfessionals,
                    BudgetMin = r.JobDetails.BudgetMin,
                    BudgetMax = r.JobDetails.BudgetMax,
                    ContactEmail = r.JobDetails.ContactEmail,
                    ContactPhone = r.JobDetails.ContactPhone

                })
                .FirstOrDefaultAsync() ?? throw new InvalidOperationException();
        }

        public async Task<bool> CreateJobAsync(JobDto createJobDto)
        {
            var Job = new Job
            {
                CustomerId = createJobDto.UserId,
                JobType = createJobDto.JobType,
                JobTitle = createJobDto.JobTitle,
                AdditionalDetails = createJobDto.AdditionalDetails,
                Status = JobStatus.Open,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                JobDetails = new JobDetail
                {
                    Postcode = createJobDto.Postcode,
                    PurchaseType = createJobDto.PurchaseType,
                    PropertyType = createJobDto.PropertyType,
                    JourneyProgress = createJobDto.JourneyProgress,
                    SelectedProfessionals = createJobDto.SelectedProfessionals,
                    BudgetMin = createJobDto.BudgetMin,
                    BudgetMax = createJobDto.BudgetMax,
                    ContactEmail = createJobDto.ContactEmail,
                    ContactPhone = createJobDto.ContactPhone
                }
            };
            
            _context.Jobs.Add(Job);
            try
            {
                //TODO: Call matching service function IdentifySuitableProfessionalsAsync(int jobId)
                //TODO: Call repo to add row to JobProfessionalLink table
                await _context.SaveChangesAsync();
                
                return true;
            }
            catch (DbUpdateException)
            {
                return false;
            }
        }

        public async Task<bool> UpdateJob(JobDto updateJobDto)
        {
            var Job = await _context.Jobs.Include(r => r.JobDetails).FirstOrDefaultAsync(r => r.JobId == updateJobDto.JobId);
            if (Job == null)
            {
                return false;
            }

            Job.JobType = updateJobDto.JobType;
            Job.AdditionalDetails = updateJobDto.AdditionalDetails;
            Job.UpdatedAt = DateTime.UtcNow;

            if (Job.JobDetails != null)
            {
                _context.JobDetails.Remove(Job.JobDetails);
            }

            Job.JobDetails = new JobDetail
            {
                JobId = updateJobDto.JobId,
                Postcode = updateJobDto.JobDetail.Postcode,
                PurchaseType = updateJobDto.JobDetail.PurchaseType,
                PropertyType = updateJobDto.JobDetail.PropertyType,
                JourneyProgress = updateJobDto.JobDetail.JourneyProgress,
                SelectedProfessionals = updateJobDto.JobDetail.SelectedProfessionals,
                BudgetMin = updateJobDto.JobDetail.BudgetMin,
                BudgetMax = updateJobDto.JobDetail.BudgetMax,
                ContactEmail = updateJobDto.JobDetail.ContactEmail,
                ContactPhone = updateJobDto.JobDetail.ContactPhone
            };

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateException)
            {
                return false;
            }
        }

        public async Task<bool> DeleteJob(int JobId)
        {
            var Job = await _context.Jobs.Include(r => r.JobDetails).FirstOrDefaultAsync(r => r.JobId == JobId);
            if (Job == null)
            {
                return false;
            }

            if (Job.JobDetails != null)
            {
                _context.JobDetails.Remove(Job.JobDetails);
            }

            _context.Jobs.Remove(Job);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
