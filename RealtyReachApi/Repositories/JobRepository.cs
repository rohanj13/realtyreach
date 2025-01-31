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
}