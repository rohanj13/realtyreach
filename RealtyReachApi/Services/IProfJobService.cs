using RealtyReachApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using RealtyReachApi.Dtos;

namespace RealtyReachApi.Services
{
    public interface IProfJobService
    {
        Task<List<GetFinalisedJobDto>> GetFinalisedJobsForProfessionalAsync(Guid professionalId);
    }
}
