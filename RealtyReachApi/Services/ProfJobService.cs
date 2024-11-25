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
using RealtyReachApi.Interfaces;

namespace RealtyReachApi.Services
{
    public class ProfJobService(SharedDbContext context, JourneyProgressOptions options) : IProfJobService
    {
        private readonly SharedDbContext _context = context;
        private readonly JourneyProgressOptions _options = options;

        public async Task<List<JobDto>> GetApplicableJobsForProfessional(int professionalId)
        {
            //add logic to get the professional type from the user manager
            // string userId = User.Identity.userName;
            return await _context.Jobs
                .Include(r => r.JobDetails)
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
                .ToListAsync();
        }
    }
}
