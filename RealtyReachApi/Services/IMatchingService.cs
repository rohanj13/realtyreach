using RealtyReachApi.Dtos;
using RealtyReachApi.Models;

namespace RealtyReachApi.Services;

public interface IMatchingService
{
    Task<List<Professional>> IdentifySuitableProfessionalsAsync(string[] selectedProfessionals);
    Task<bool> FinalizeMatchAsync(MatchingJobDto matchingJobDto);
}