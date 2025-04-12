using RealtyReachApi.Dtos;
using RealtyReachApi.Models;
using RealtyReachApi.Repositories;

namespace RealtyReachApi.Services;

public class MatchingService : IMatchingService
{
    private readonly IJobRepository _jobRepository;
    private readonly IProfessionalRepository _professionalRepository;
    private readonly ILocationService _locationService;

    public MatchingService(IJobRepository jobRepository, IProfessionalRepository professionalRepository, ILocationService locationService)
    {
        _jobRepository = jobRepository;
        _professionalRepository = professionalRepository;
        _locationService = locationService;
    }

    //TODO: Change to accept JobDto in the argument
    public async Task<List<Professional>> IdentifySuitableProfessionalsAsync(Job job)
{
    if (job.JobDetails == null) throw new InvalidDataException("Job details are empty");

    List<int> professionalTypeIds = job.JobDetails.SelectedProfessionals
        .Select(selectedProfessional =>
            (ProfessionalType.ProfessionalTypeEnum)Enum.Parse(typeof(ProfessionalType.ProfessionalTypeEnum), selectedProfessional))
        .Select(id => (int)id)
        .ToList();

    if (professionalTypeIds.Count == 0) throw new InvalidDataException("No suitable professionals found");

    var suitableProfessionals =
        await _professionalRepository.GetProfessionalsByProfessionalTypeIdsAsync(professionalTypeIds);

    // Score each professional asynchronously
    var scoredProfessionals = await Task.WhenAll(
        suitableProfessionals.Select(async professional => new ScoredProfessionalDto
        {
            Professional = professional,
            Score = CalculateScore(professional, job)
        }));

    // Group, sort, and take top 5 in each group
    List<List<ScoredProfessionalDto>> groupedProfessionals = scoredProfessionals
        .GroupBy(sp => sp.Professional.ProfessionalTypeId)
        .Select(group => group.OrderByDescending(sp => sp.Score).Take(5).ToList())
        .ToList();

    // Debug logging (optional)
    foreach (var spL in groupedProfessionals)
    {
        Console.WriteLine(
            $"\nGroup: {(ProfessionalType.ProfessionalTypeEnum)spL.First().Professional.ProfessionalTypeId}");
        foreach (var sp in spL)
        {
            Console.WriteLine(
                $"  - {sp.Professional.Email} | Verified: {sp.Professional.VerificationStatus} | Score: {sp.Score}");
        }
    }

    var gp = groupedProfessionals.SelectMany(sp => sp)
        .Select(p => p.Professional)
        .ToList();

    foreach (var p in gp)
    {
        Console.WriteLine(
            $"\nProfessionalType: {(ProfessionalType.ProfessionalTypeEnum)p.ProfessionalTypeId}");
        Console.WriteLine(
            $"  - {p.Email}");
    }

    return gp;
}


    //Get MatchingJobDto that has job id and selected professional id
    public async Task<bool> FinalizeMatchAsync(MatchingJobDto matchingJobDto)
    {
        Job? tempJob = await _jobRepository.GetJobByIdAsync(matchingJobDto.JobId);
        JobProfessionalLink jobProfessionalLink = new JobProfessionalLink();
        if (tempJob != null) {
            jobProfessionalLink.JobDetailId = tempJob.JobDetails.JobDetailId;
            jobProfessionalLink.ProfessionalId = matchingJobDto.ProfessionalId;
            jobProfessionalLink.AssignedDate = DateTime.UtcNow;
            jobProfessionalLink.SelectionDate = DateTime.UtcNow;
            
            //Run db transaction to store the matches to JobProfessionalLink table
            await _jobRepository.MatchJobAsync(jobProfessionalLink);
            
            //Update the JobDetail SuggestedProfessionals attribute to remove matched professional id
            tempJob.JobDetails.SuggestedProfessionalIds = Array.FindAll
            (tempJob.JobDetails.SuggestedProfessionalIds, val => val != matchingJobDto.ProfessionalId);
            await _jobRepository.UpdateJobAsync(tempJob);
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * Matching algorithm returning an associated score for each professional.
     */
    private int CalculateScore(Professional professional, Job job)
    {
        var score = 0;
        //int locationScore = 0;
        score += _locationService.CalculateMatchingScore(job, professional);
        //score += locationScore;
        if (professional.VerificationStatus) score += 10; // Verified Professionals get +10 points
        if (!string.IsNullOrEmpty(professional.ABN)) score += 5; // ABN non-empty match gets +5 points
        return score;
    }

    // private static double CalculateLocationScore(Professional professional, Job job)
    // {
    //     var score = 0;
    //     
    // }
}