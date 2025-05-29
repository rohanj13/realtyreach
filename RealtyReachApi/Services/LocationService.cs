using Microsoft.IdentityModel.Tokens;
using RealtyReachApi.Models;
using RealtyReachApi.Repositories;

namespace RealtyReachApi.Services;

public class LocationService : ILocationService
{
    private readonly ILocationRepository _locationRepository;

    public LocationService(ILocationRepository locationRepository)
    {
        _locationRepository = locationRepository;
    }

    // public async Task<List<Suburb>> GetAllSuburbsAsync()
    // {
    //     return await _locationRepository.GetAllSuburbsAsync();
    // }

    public async Task<List<string>> GetAllRegionsAsync()
    {
        return await _locationRepository.GetAllRegionsAsync();
    }

    public async Task<List<string>> GetAllStatesAsync()
    {
        return await _locationRepository.GetAllStatesAsync();
    }

    public async Task<List<string>> SearchLocationsAsync(string query)
    {
        return await _locationRepository.SearchLocationsAsync(query);
    }
    
    public int CalculateMatchingScore(Job job, Professional professional)
    {
        int score = 0;
        //var allSuburbs = await _locationRepository.GetAllSuburbsAsync();
        // find all the suburbs from the database
        // var jobSuburbs = await _locationRepository.GetSuburbsByIdsAsync(job.JobDetails.SuburbIds);
        // var professionalSuburbs = await _locationRepository.GetSuburbsByIdsAsync(job.JobDetails.SuburbIds);

        // Suburb-to-Suburb Matching (Haversine Distance)
        //TODO: add check to see if there are any suburbs
        // foreach (var jobSuburb in jobSuburbs)
        // {
        //     foreach (var profSuburb in professionalSuburbs)
        //     {
        //         double distance = HaversineDistance(jobSuburb.Latitude, jobSuburb.Longitude, profSuburb.Latitude, profSuburb.Longitude);
        //
        //         if (distance == 0) 
        //             score += 100;
        //         else if (distance <= 20) 
        //             score += 80;
        //         else if (distance <= 50) 
        //             score += 50;
        //         else if (distance <= 100) 
        //             score += 0;
        //     }
        // }

        // Suburb-to-Region Matching
        // foreach (var jobSuburb in jobSuburbs)
        // {
        //     if (professional.Regions.Contains(jobSuburb.Region))
        //     {
        //         score += 80;
        //     }
        // }

        // Region-to-Region Matching
        //TODO: add check to see if any of the fields exist
        
        if (!job.JobDetails.Regions.IsNullOrEmpty() && !professional.Regions.IsNullOrEmpty() &&
            job.JobDetails.Regions.Intersect(professional.Regions).Any())
        {
            score += 80;
        }

        // State-to-State Matching
        else if (!job.JobDetails.States.IsNullOrEmpty() && !professional.States.IsNullOrEmpty() &&
            job.JobDetails.States.Intersect(professional.States).Any())
        {
            Console.WriteLine("Calculating state score");
            score += 30;
        }

        else if (!job.JobDetails.Regions.IsNullOrEmpty() && !professional.States.IsNullOrEmpty())
        {
            List<AustralianState> jobStates = new List<AustralianState>();
            foreach (var region in job.JobDetails.Regions)
            {
                jobStates.Add(getStateForRegion(region));
            }

            if (jobStates.Intersect(professional.States).Any())
            {
                score += 50;
            }
        }
        
        else if (!job.JobDetails.States.IsNullOrEmpty() && !professional.Regions.IsNullOrEmpty())
        {
            List<AustralianState> professionalStates = new List<AustralianState>();
            foreach (var region in professional.Regions)
            {
                professionalStates.Add(getStateForRegion(region));
            }

            if (professionalStates.Intersect(job.JobDetails.States).Any())
            {
                score += 50;
            }
        }
        
        return score;
    }

    private double HaversineDistance(double lat1, double lon1, double lat2, double lon2)
    {
        const double R = 6371; // Earth radius in km
        double dLat = DegreesToRadians(lat2 - lat1);
        double dLon = DegreesToRadians(lon2 - lon1);

        double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                   Math.Cos(DegreesToRadians(lat1)) * Math.Cos(DegreesToRadians(lat2)) *
                   Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

        double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return R * c;
    }

    private double DegreesToRadians(double degrees)
    {
        return degrees * Math.PI / 180;
    }

    public AustralianState getStateForRegion(string region)
    {
        return _locationRepository.GetStateForRegionAsync(region).Result;
    }
}