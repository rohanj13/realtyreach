using Microsoft.EntityFrameworkCore;
using RealtyReachApi.Data;
using RealtyReachApi.Models;
using RealtyReachApi.Dtos;

namespace RealtyReachApi.Repositories;

public class JobRepository : IJobRepository
{
    private readonly SharedDbContext _context;

    public JobRepository(SharedDbContext context)
    {
        _context = context;
    }

    public async Task<Job?> GetJobByIdAsync(int jobId)
    {
        return await _context.Jobs.Include(j => j!.JobDetails)
            .ThenInclude(jd => jd.ProfessionalTypes)
            .FirstOrDefaultAsync(j => j!.JobId == jobId);
    }

    public async Task<List<Job>> GetAllJobsforCustomerAsync(Guid customerId)
    {
        return await _context.Jobs
            .Include(r => r.JobDetails)
            .Where(r => r.CustomerId == customerId)
            .ToListAsync();
    }

    public async Task<Job?> CreateJobAsync(Job? job)
    {
        _context.Jobs.Add(job);
        await _context.SaveChangesAsync();
        return job;
    }

    public Task<JobDetail?> GetJobDetailWithProfessionalTypesAsync(int jobId)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> UpdateJobAsync(Job? job)
    {
        if (job == null)
        {
            return false;
        }

        var existingJob = await _context.Jobs.FindAsync(job.JobId);
        if (existingJob == null)
        {
            return false;
        }

        _context.Entry(existingJob).CurrentValues.SetValues(job);

        return await _context.SaveChangesAsync() > 0;
    }

    public Task<bool> DeleteJobAsync(int jobId)
    {
        throw new NotImplementedException();
    }

    public async Task<JobProfessionalLink> MatchJobAsync(JobProfessionalLink jobProfessionalLink)
    {
        _context.JobProfessionalLink.Add(jobProfessionalLink);
        await _context.SaveChangesAsync();
        return jobProfessionalLink;
    }

    // public async Task<JobDetailDto?> GetJobDetailWithProfessionalTypesAsync(int jobId)
    // {
    //     var jobDetail = await _context.JobDetails
    //         .Include(jd => jd.ProfessionalTypeId)
    //         .Where(jd => jd.JobId == jobId)
    //         .Select(jd => new JobDetailDto
    //         {
    //             JobDetailId = jd.JobDetailId,
    //             JobId = jd.JobId,
    //             LocationOrPostCode = jd.LocationOrPostCode,
    //             PurchaseType = jd.PurchaseType,
    //             PropertyType = jd.PropertyType,
    //             JourneyProgress = jd.JourneyProgress,
    //             BudgetMin = jd.BudgetMin,
    //             BudgetMax = jd.BudgetMax,
    //             ContactEmail = jd.ContactEmail,
    //             ContactPhone = jd.ContactPhone,
    //             JobDetailProfessionalTypeIds = jd.ProfessionalType
    //                 .Select(jdpt => jdpt.ProfessionalTypeId)
    //                 .ToList()
    //         })
    //         .FirstOrDefaultAsync();
    //
    //     return jobDetail;
    // }

    public async Task<List<JobProfessionalLink>> GetFinalisedJobsForProfessionalAsync(Guid professionalId)
    {
        return await _context.JobProfessionalLink
            .Include(jpl => jpl.JobDetail)
                .ThenInclude(jd => jd.Job)
            .Where(jpl => jpl.ProfessionalId == professionalId)
            .OrderByDescending(jpl => jpl.AssignedDate)
            .ToListAsync();
    }

    public async Task<List<Guid>> GetFinalisedProfessionalLinksByJobDetailIdAsync(int jobDetailId)
    {
        return await _context.JobProfessionalLink
            .Where(jpl => jpl.JobDetailId == jobDetailId)
            .Select(jpl => jpl.ProfessionalId)
            .Distinct()
            .ToListAsync();
    }

    public async Task<List<Job>> GetAllJobsAsync()
    {
        return await _context.Jobs
            .Include(r => r.JobDetails)
            .ToListAsync();
    }
}