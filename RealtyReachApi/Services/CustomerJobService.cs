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
        private readonly SharedDbContext _context;
        private readonly IProfessionalTypeRepository _professionalTypeRepository;

        public CustomerJobService(SharedDbContext context, IProfessionalTypeRepository professionalTypeRepository)
        {
            _context = context;
            _professionalTypeRepository = professionalTypeRepository;
        }

        public async Task<List<JobDto>> GetAllJobsForCustomer(Guid userId)
        {
            return await _context.Jobs
                .Include(r => r.JobDetails)
                .Where(r => r.CustomerId == userId)
                .Select(r => new JobDto
                {
                    JobId = r.JobId,
                    UserId = r.CustomerId,
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
                        JobDetailProfessionalTypeIds = r.JobDetails.ProfessionalTypes
                            .Select(jdpt => jdpt.Id)
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
                    UserId = r.CustomerId,
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
                        JobDetailProfessionalTypeIds = r.JobDetails.ProfessionalTypes
                            .Select(jdpt => jdpt.Id)
                            .ToList()
                    }
                })
                .FirstOrDefaultAsync() ?? throw new InvalidOperationException();
        }

        public async Task<JobDto> CreateJobAsync(CreateJobDto createJobDto)
        {
            // Map JourneyProgress to appropriate ProfessionalTypes
            var professionalTypes = await DetermineProfessionalTypesAsync(createJobDto.JobDetail.JourneyProgress);

            var job = new Job
            {
                CustomerId = createJobDto.UserId,
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

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            return new JobDto
            {
                JobId = job.JobId,
                UserId = job.CustomerId,
                JobType = job.JobType,
                AdditionalDetails = job.AdditionalDetails,
                Status = job.Status,
                CreatedAt = job.CreatedAt,
                UpdatedAt = job.UpdatedAt,
                JobDetail = new JobDetailDto
                {
                    JobDetailId = job.JobDetails.JobDetailId,
                    JobId = job.JobId,
                    LocationOrPostCode = job.JobDetails.LocationOrPostCode,
                    PurchaseType = job.JobDetails.PurchaseType,
                    PropertyType = job.JobDetails.PropertyType,
                    JourneyProgress = job.JobDetails.JourneyProgress,
                    BudgetMin = job.JobDetails.BudgetMin,
                    BudgetMax = job.JobDetails.BudgetMax,
                    ContactEmail = job.JobDetails.ContactEmail,
                    ContactPhone = job.JobDetails.ContactPhone,
                    JobDetailProfessionalTypeIds = job.JobDetails.ProfessionalTypes
                        .Select(jdpt => jdpt.Id)
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
        
        private async Task<List<ProfessionalType>> DetermineProfessionalTypesAsync(string journeyProgress)
        {
            // Define mappings of JourneyProgress to ProfessionalTypes
            List<string> typeNames;
            switch (journeyProgress)
            {
                case "Started":
                    typeNames = new List<string> { "Advocate", "Broker" };
                    break;
                case "Pre-Approval":
                    typeNames = new List<string> { "PestInspector" };
                    break;
                case "Post-Purchase":
                    typeNames = new List<string> { "Advocate", "Broker", "PestInspector" };
                    break;
                default:
                    typeNames = new List<string>();
                    break;
            }

            // Fetch ProfessionalType entities from the database based on type names
            return await _professionalTypeRepository.GetProfessionalTypeByNamesAsync(typeNames);
        }
    }
}
