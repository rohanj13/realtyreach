using RealtyReachApi.Models;

namespace RealtyReachApi.Services;

public interface ILocationService
{
    // Task<List<Suburb>> GetAllSuburbsAsync();
    Task<List<string>> GetAllRegionsAsync();
    Task<List<string>> GetAllStatesAsync();
    Task<List<string>> SearchLocationsAsync(string query);
    int CalculateMatchingScore(Job job, Professional professional);
}