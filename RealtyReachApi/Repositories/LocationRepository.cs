using Microsoft.EntityFrameworkCore;
using RealtyReachApi.Data;
using RealtyReachApi.Models;
using RealtyReachApi.Services;

namespace RealtyReachApi.Repositories;

public class LocationRepository : ILocationRepository
{
    private readonly SharedDbContext _context;

    public LocationRepository(SharedDbContext context)
    {
        _context = context;
    }

    // public async Task<List<Suburb>> GetAllSuburbsAsync()
    // {
    //     return await _context.Suburbs.ToListAsync();
    // }

    public async Task<List<string>> GetAllRegionsAsync()
    {
        return await _context.Suburbs.Select(s => s.Region).Distinct().ToListAsync();
    }

    public async Task<List<string>> GetAllStatesAsync()
    {
        return Enum.GetNames(typeof(AustralianState)).ToList();
    }

    public async Task<List<string>> SearchLocationsAsync(string query)
    {
        return await _context.Suburbs
            .Where(s => s.Region.Contains(query) || s.State.ToString().Contains(query))
            .Select(s => s.Locality)
            .Distinct()
            .Take(10)
            .ToListAsync();
    }

    public async Task<List<Suburb>> GetSuburbsByIdsAsync(List<int> suburbIds)
    {
        return await _context.Suburbs.Where(s => suburbIds.Contains(s.Id)).ToListAsync();
    }
    public async Task<AustralianState> GetStateForRegionAsync(string regionName)
    {
        return await _context.Suburbs
            .Where(s => s.Region == regionName)
            .Select(s => s.State)
            .Distinct()
            .FirstOrDefaultAsync();
    }
}