using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealtyReachApi.Data;
using RealtyReachApi.Models;

namespace RealtyReachApi.Controllers
{
    [ApiController]
    [Route("api/jobs")]
    public class JobController : ControllerBase
    {
        private readonly SharedDbContext _context;

        public JobController(SharedDbContext context)
        {
            _context = context;
        }

        // GET: api/Jobs/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<JobDto>>> GetAllJobsForUser(int userId)
        {
            var Jobs = await _context.Jobs
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
                        ContactPhone = r.JobDetails.ContactPhone
                    }
                })
                .ToListAsync();

            if (Jobs.Count > 0)
            {
                return Ok(Jobs);
            }

            return NotFound();
        }

        // GET: api/Jobs/{JobId}
        [HttpGet("{JobId}")]
        public async Task<ActionResult<JobDto>> GetJobById(int JobId)
        {
            var Job = await _context.Jobs
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
                        ContactPhone = r.JobDetails.ContactPhone
                    }
                })
                .FirstOrDefaultAsync();

            if (Job == null)
            {
                return NotFound();
            }

            return Ok(Job);
        }

        // POST: api/Jobs
        [HttpPost]
        public async Task<ActionResult<JobDto>> CreateJob(CreateJobDto createJobDto)
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
                }
            };

            _context.Jobs.Add(Job);
            await _context.SaveChangesAsync();

            var JobDto = new JobDto
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
                    ContactPhone = Job.JobDetails.ContactPhone
                }
            };

            return CreatedAtAction(nameof(GetJobById), new { JobId = Job.JobId }, JobDto);
        }

        // PUT: api/Jobs/{JobId}
        [HttpPut("{JobId}")]
        public async Task<IActionResult> UpdateJob(int JobId, UpdateJobDto updateJobDto)
        {
            var Job = await _context.Jobs.Include(r => r.JobDetails).FirstOrDefaultAsync(r => r.JobId == JobId);
            if (Job == null)
            {
                return NotFound();
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
                return NoContent();
            }
            catch (DbUpdateException)
            {
                return BadRequest();
            }
        }

        // DELETE: api/Jobs/{JobId}
        [HttpDelete("{JobId}")]
        public async Task<IActionResult> DeleteJob(int JobId)
        {
            var Job = await _context.Jobs.Include(r => r.JobDetails).FirstOrDefaultAsync(r => r.JobId == JobId);
            if (Job == null)
            {
                return NotFound();
            }

            if (Job.JobDetails != null)
            {
                _context.JobDetails.Remove(Job.JobDetails);
            }

            _context.Jobs.Remove(Job);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}