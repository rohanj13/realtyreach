using RealtyReachApi.Dtos;
using RealtyReachApi.Models;
using RealtyReachApi.Repositories;

namespace RealtyReachApi.Services;

public class MatchingService
{
    private readonly IJobRepository _jobRepository;
    private readonly IProfessionalRepository _professionalRepository;

    public MatchingService(IJobRepository jobRepository, IProfessionalRepository professionalRepository)
    {
        _jobRepository = jobRepository;
        _professionalRepository = professionalRepository;
    }

    public async Task<List<ProfessionalDto>> IdentifySuitableProfessionalsAsync(int jobId)
    {
        // Retrieve the job from the repository
        // Get job details with required professional types
        var jobDetail = await _jobRepository.GetJobDetailWithProfessionalTypesAsync(jobId);
        if (jobDetail == null || !jobDetail.JobDetailProfessionalTypeIds.Any())
        {
            return new List<ProfessionalDto>(); // Return empty if job not found or already matched
        }

        // Get professionals matching the required professional types
        var suitableProfessionals =
            await _professionalRepository.GetProfessionalsByProfessionalTypeIdsAsync(jobDetail
                .JobDetailProfessionalTypeIds);

        return suitableProfessionals;
    }
}