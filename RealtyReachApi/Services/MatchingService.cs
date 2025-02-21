using RealtyReachApi.Dtos;
using RealtyReachApi.Models;
using RealtyReachApi.Repositories;

namespace RealtyReachApi.Services;

public class MatchingService : IMatchingService
{
    private readonly IJobRepository _jobRepository;
    private readonly IProfessionalRepository _professionalRepository;

    public MatchingService(IJobRepository jobRepository, IProfessionalRepository professionalRepository)
    {
        _jobRepository = jobRepository;
        _professionalRepository = professionalRepository;
    }

    //TODO: Change to accept JobDto in the argument
    public async Task<List<Professional>> IdentifySuitableProfessionalsAsync(Job job)
    {
        if (job.JobDetails == null) throw new InvalidDataException("Job details are empty");
        List<int> professionalTypeIds = [];
        professionalTypeIds.AddRange(job.JobDetails.SelectedProfessionals.Select(selectedProfessional =>
            (ProfessionalType.ProfessionalTypeEnum)Enum.Parse(typeof(ProfessionalType.ProfessionalTypeEnum),
                selectedProfessional)).Select(id => (int)id));

        if (professionalTypeIds.Count == 0) throw new InvalidDataException("No suitable professionals found");

        // Get professionals matching the required professional types
        // TODO: Read this https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/tutorials/pattern-matching
        var suitableProfessionals =
            await _professionalRepository.GetProfessionalsByProfessionalTypeIdsAsync(professionalTypeIds);

        // Separate the suitable professionals into lists based on type
        
        List<List<ScoredProfessionalDto>> groupedProfessionals = suitableProfessionals
            .Select(professional => new ScoredProfessionalDto
                { Professional = professional, Score = CalculateScore(professional, job) }) // Assign score
            .GroupBy(sp => sp.Professional.ProfessionalTypeId) // Group by type
            .Select(group => group.OrderByDescending(sp => sp.Score).Take(5).ToList()) // Sort & take top 5
            .ToList();

        // Printing results of scoring algorithm. Should be deleted before Production
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

        return suitableProfessionals;
    }

    //TODO: Get MatchingJobDto that has job id and selected professional id
    public async Task<bool> FinalizeMatchAsync()
    {
        //TODO: Run db transaction to store the matches to JobProfessionalLink table
        //TODO: Update the JobDetail SuggestedProfessionals attribute to remove matched professional id
        throw new NotImplementedException();
    }

    /**
     * Matching algorithm returning an associated score for each professional.
     */
    private static int CalculateScore(Professional professional, Job job)
    {
        var score = 0;

        if (professional.VerificationStatus) score += 10; // Verified Professionals get +10 points
        if (!string.IsNullOrEmpty(professional.ABN)) score += 5; // ABN non-empty match gets +5 points
        return score;
    }
}