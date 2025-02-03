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
    }
}
