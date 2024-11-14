// JobService.cs
using Microsoft.EntityFrameworkCore;
using RealtyReachApi.Data;
using RealtyReachApi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealtyReachApi.Services
{
    public class UserJobService : IUserJobService
    {
        private readonly SharedDbContext _context;

        public UserJobService(SharedDbContext context)
        {
            _context = context;
        }

        public async Task<List<JobDto>> GetAllJobsForUser(int userId)
        {
            return await _context.Jobs
                .Include(r => r.JobDetails)
                .Where(r => r.UserId == userId)
                .Select(r => new JobDto
                {
                    JobId = r.JobId,
                    UserId = r.UserId,
                    JobType = r.JobType,
                    AdditionalDetails = r.AdditionalDetails,
                    Status = r.Status,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt,
                    JobDetail = new JobDetailDto
                    {
                        JobDetailId = r.JobDetails.JobDetailId,
                        JobId = r.JobId,
                        LocationOrPostCode = r.JobDetails.LocationOrPostCode,
                        PurchaseType = r.JobDetails.PurchaseType,
                        PropertyType = r.JobDetails.PropertyType,
                        JourneyProgress = r.JobDetails.JourneyProgress,
                        BudgetMin = r.JobDetails.BudgetMin,
                        BudgetMax = r.JobDetails.BudgetMax,
                        ContactEmail = r.JobDetails.ContactEmail,
                        ContactPhone = r.JobDetails.ContactPhone,
                        JobDetailProfessionalTypeIds = r.JobDetails.JobDetailProfessionalTypes
                            .Select(jdpt => jdpt.ProfessionalTypeId)
                            .ToList()
                    }
                })
                .ToListAsync();
        }

        public async Task<JobDto> GetJobById(int JobId)
        {
            return await _context.Jobs
                .Include(r => r.JobDetails)
                .Where(r => r.JobId == JobId)
                .Select(r => new JobDto
                {
                    JobId = r.JobId,
                    UserId = r.UserId,
                    JobType = r.JobType,
                    AdditionalDetails = r.AdditionalDetails,
                    Status = r.Status,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt,
                    JobDetail = new JobDetailDto
                    {
                        JobDetailId = r.JobDetails.JobDetailId,
                        JobId = r.JobId,
                        LocationOrPostCode = r.JobDetails.LocationOrPostCode,
                        PurchaseType = r.JobDetails.PurchaseType,
                        PropertyType = r.JobDetails.PropertyType,
                        JourneyProgress = r.JobDetails.JourneyProgress,
                        BudgetMin = r.JobDetails.BudgetMin,
                        BudgetMax = r.JobDetails.BudgetMax,
                        ContactEmail = r.JobDetails.ContactEmail,
                        ContactPhone = r.JobDetails.ContactPhone,
                        JobDetailProfessionalTypeIds = r.JobDetails.JobDetailProfessionalTypes
                            .Select(jdpt => jdpt.ProfessionalTypeId)
                            .ToList()
                    }
                })
                .FirstOrDefaultAsync() ?? throw new InvalidOperationException();
        }

        public async Task<JobDto> CreateJob(CreateJobDto createJobDto)
        {
            var Job = new Job
            {
                UserId = createJobDto.UserId,
                JobType = createJobDto.JobType,
                AdditionalDetails = createJobDto.AdditionalDetails,
                Status = createJobDto.Status,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                JobDetails = new JobDetail
                {
                    LocationOrPostCode = createJobDto.JobDetail.LocationOrPostCode,
                    PurchaseType = createJobDto.JobDetail.PurchaseType,
                    PropertyType = createJobDto.JobDetail.PropertyType,
                    JourneyProgress = createJobDto.JobDetail.JourneyProgress,
                    BudgetMin = createJobDto.JobDetail.BudgetMin,
                    BudgetMax = createJobDto.JobDetail.BudgetMax,
                    ContactEmail = createJobDto.JobDetail.ContactEmail,
                    ContactPhone = createJobDto.JobDetail.ContactPhone
                },
                IsMatched = false
            };

            _context.Jobs.Add(Job);
            await _context.SaveChangesAsync();

            return new JobDto
            {
                JobId = Job.JobId,
                UserId = Job.UserId,
                JobType = Job.JobType,
                AdditionalDetails = Job.AdditionalDetails,
                Status = Job.Status,
                CreatedAt = Job.CreatedAt,
                UpdatedAt = Job.UpdatedAt,
                JobDetail = new JobDetailDto
                {
                    JobDetailId = Job.JobDetails.JobDetailId,
                    JobId = Job.JobId,
                    LocationOrPostCode = Job.JobDetails.LocationOrPostCode,
                    PurchaseType = Job.JobDetails.PurchaseType,
                    PropertyType = Job.JobDetails.PropertyType,
                    JourneyProgress = Job.JobDetails.JourneyProgress,
                    BudgetMin = Job.JobDetails.BudgetMin,
                    BudgetMax = Job.JobDetails.BudgetMax,
                    ContactEmail = Job.JobDetails.ContactEmail,
                    ContactPhone = Job.JobDetails.ContactPhone,
                    JobDetailProfessionalTypeIds = Job.JobDetails.JobDetailProfessionalTypes
                        .Select(jdpt => jdpt.ProfessionalTypeId)
                        .ToList()
                }
            };
        }

        public async Task<bool> UpdateJob(int JobId, UpdateJobDto updateJobDto)
        {
            var Job = await _context.Jobs.Include(r => r.JobDetails).FirstOrDefaultAsync(r => r.JobId == JobId);
            if (Job == null)
            {
                return false;
            }

            Job.JobType = updateJobDto.JobType;
            Job.AdditionalDetails = updateJobDto.AdditionalDetails;
            Job.Status = updateJobDto.Status;
            Job.UpdatedAt = DateTime.UtcNow;

            if (Job.JobDetails != null)
            {
                _context.JobDetails.Remove(Job.JobDetails);
            }

            Job.JobDetails = new JobDetail
            {
                JobId = JobId,
                LocationOrPostCode = updateJobDto.JobDetail.LocationOrPostCode,
                PurchaseType = updateJobDto.JobDetail.PurchaseType,
                PropertyType = updateJobDto.JobDetail.PropertyType,
                JourneyProgress = updateJobDto.JobDetail.JourneyProgress,
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
