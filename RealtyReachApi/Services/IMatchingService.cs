using RealtyReachApi.Dtos;

namespace RealtyReachApi.Services;

public interface IMatchingService
{
    Task<List<ProfessionalDto>> IdentifySuitableProfessionalsAsync(int jobId);
}