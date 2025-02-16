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
    public async Task<List<Professional>> IdentifySuitableProfessionalsAsync(string[] selectedProfessionals)
    {
        // Retrieve the job from the repository
        // Get job details with required professional types
        //var jobDetail = await _jobRepository.GetJobDetailWithProfessionalTypesAsync(jobId);
        /*if (jobDetail == null || !jobDetail.JobDetailProfessionalTypeIds.Any())
        {
            return new List<ProfessionalDto>(); // Return empty if job not found or already matched
        }
        */
        List<int> professionalTypeIds = [];
        foreach (var selectedProfessional in selectedProfessionals)
        {
            ProfessionalType.ProfessionalTypeEnum id =
                (ProfessionalType.ProfessionalTypeEnum)Enum.Parse(typeof(ProfessionalType.ProfessionalTypeEnum),
                    selectedProfessional);
            professionalTypeIds.Add((int)id);
        }

        // Get professionals matching the required professional types
        // TODO: Read this https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/tutorials/pattern-matching
        var suitableProfessionals =
            await _professionalRepository.GetProfessionalsByProfessionalTypeIdsAsync(professionalTypeIds);

        // Separate the suitable professionals into lists based on type
        List<List<Professional>> groupedProfessionals = suitableProfessionals
            .GroupBy(professional => professional.ProfessionalTypeId)
            .Select(group => group.ToList())
            .ToList();
        //TODO: Run scoring algorithm on each list and return top 5 of each type
        // Console.WriteLine(suitableProfessionals[0].ProfessionalTypeId);
        return suitableProfessionals;
    }

    //TODO: Get MatchingJobDto that has job id and selected professional id
    public async Task<bool> FinalizeMatchAsync(MatchingJobDto matchingJobDto)
    {
        Job? tempJob = await _jobRepository.GetJobByIdAsync(matchingJobDto.JobId);
        JobProfessionalLink jobProfessionalLink = new JobProfessionalLink();
        if (tempJob != null) {
            jobProfessionalLink.JobDetailId = tempJob.JobDetails.JobDetailId;
            jobProfessionalLink.ProfessionalId = matchingJobDto.ProfessionalId;
            
            //TODO: Run db transaction to store the matches to JobProfessionalLink table
            await _jobRepository.MatchJobAsync(jobProfessionalLink);
            
            //TODO: Update the JobDetail SuggestedProfessionals attribute to remove matched professional id
            tempJob.JobDetails.SuggestedProfessionalIds = Array.FindAll
            (tempJob.JobDetails.SuggestedProfessionalIds, val => val != matchingJobDto.ProfessionalId);
            await _jobRepository.UpdateJobAsync(tempJob);
            return true;
        }
        else {
            return false;
        }
    }
}