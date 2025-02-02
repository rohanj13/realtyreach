using RealtyReachApi.Models;

namespace RealtyReachApi.Services;

public interface IMatchingService
{
    Task<List<Professional>> IdentifySuitableProfessionalsAsync(string[] selectedProfessionals);
}