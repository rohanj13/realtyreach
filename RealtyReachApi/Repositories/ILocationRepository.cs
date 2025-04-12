using RealtyReachApi.Models;

namespace RealtyReachApi.Repositories;

public interface ILocationRepository
{
    // Task<List<Suburb>> GetAllSuburbsAsync();
    Task<List<string>> GetAllRegionsAsync();
    Task<List<string>> GetAllStatesAsync();
    Task<List<string>> SearchLocationsAsync(string query);
    Task<List<Suburb>> GetSuburbsByIdsAsync(List<int> suburbIds);
    Task<AustralianState> GetStateForRegionAsync(string regionName);
}