using RealtyReachApi.Dtos;
using RealtyReachApi.Models;

namespace RealtyReachApi.Services;

public interface IMatchingService
{
    Task<List<Professional>> IdentifySuitableProfessionalsAsync(Job job);
    Task<bool> FinalizeMatchAsync(MatchingJobDto matchingJobDto);
}