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
        private readonly IJobRepository _jobRepository;
        private IMatchingService _matchingService;
        private readonly SharedDbContext _context;

        public CustomerJobService(
            IProfessionalTypeRepository professionalTypeRepository, 
            IMatchingService matchingService,
            IJobRepository jobRepository
            )
        {
            _professionalTypeRepository = professionalTypeRepository;
            _matchingService = matchingService;
            _jobRepository = jobRepository;
        }

        public async Task<List<JobDto>> GetAllJobsForCustomer(Guid userId)
        {
            // TODO: Return a list of JobIds to the frontent
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
            // TODO: Retrieve Job information including link to selected / matched professional
            // TODO: Return a new DTO with updated Job Information (maybe??)
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

        public async Task<bool> CreateJobAsync(CreateJobDto createJobDto, Guid customerId)
        {
            try
            {
                List<Professional> professionals =
                    await _matchingService.IdentifySuitableProfessionalsAsync(createJobDto.SelectedProfessionals);
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
                            Postcode = createJobDto.Postcode,
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

            /*
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
            */

            try
            {
                await _context.SaveChangesAsync();
                // Call Matching Service to IdentifySuitableProfessionalsAsync
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
