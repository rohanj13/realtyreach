using RealtyReachApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RealtyReachApi.Services
{
    public interface IProfJobService
    {
        Task<List<JobDto>> GetApplicableJobsForProfessional(int professionalId);
    }
}
