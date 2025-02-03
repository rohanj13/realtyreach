using RealtyReachApi.Dtos;
using RealtyReachApi.Models;

namespace RealtyReachApi.Mappers;

public class JobMapper : IJobMapper
{
    // Job to JobDto
    public JobDto ToJobDto(Job job)
    {
        return new JobDto
        {
            JobId = job.JobId,
            UserId = job.CustomerId,
            JobType = job.JobType,
            JobTitle = job.JobTitle,
            Postcode = job.JobDetails?.Postcode ?? string.Empty,
            PurchaseType = job.JobDetails?.PurchaseType ?? string.Empty,
            PropertyType = job.JobDetails?.PropertyType ?? string.Empty,
            JourneyProgress = job.JobDetails?.JourneyProgress ?? string.Empty,
            SelectedProfessionals = job.JobDetails?.SelectedProfessionals ?? Array.Empty<string>(),
            SuggestedProfessionalIds = job.JobDetails?.SuggestedProfessionalIds ?? Array.Empty<int>(),
            Status = job.Status.ToString(),
            BudgetMin = job.JobDetails?.BudgetMin ?? 0,
            BudgetMax = job.JobDetails?.BudgetMax ?? 0,
            ContactEmail = job.JobDetails?.ContactEmail ?? string.Empty,
            ContactPhone = job.JobDetails?.ContactPhone ?? string.Empty,
            AdditionalDetails = job.AdditionalDetails
        };
    }

    // JobDto to Job
    public Job ToJobEntity(JobDto jobDto)
    {
        return new Job
        {
            JobId = jobDto.JobId,
            CustomerId = jobDto.UserId,
            JobType = jobDto.JobType,
            JobTitle = jobDto.JobTitle,
            AdditionalDetails = jobDto.AdditionalDetails,
            Status = Enum.Parse<JobStatus>(jobDto.Status), // Assuming you have an enum for JobStatus
            JobDetails = new JobDetail
            {
                Postcode = jobDto.Postcode,
                PurchaseType = jobDto.PurchaseType,
                PropertyType = jobDto.PropertyType,
                JourneyProgress = jobDto.JourneyProgress,
                SelectedProfessionals = jobDto.SelectedProfessionals,
                SuggestedProfessionalIds = jobDto.SuggestedProfessionalIds,
                BudgetMin = jobDto.BudgetMin,
                BudgetMax = jobDto.BudgetMax,
                ContactEmail = jobDto.ContactEmail,
                ContactPhone = jobDto.ContactPhone
            }
        };
    }

    // CreateJobDto to Job Entity
    public Job ToJobEntity(CreateJobDto createJobDto, Guid customerId)
    {
        return new Job
        {
            CustomerId = customerId,
            JobTitle = createJobDto.JobTitle,
            JobType = createJobDto.JobType,
            AdditionalDetails = createJobDto.AdditionalDetails ?? string.Empty,
            Status = JobStatus.Open, // Assuming default status is Open
            JobDetails = new JobDetail
            {
                Postcode = createJobDto.Postcode,
                PurchaseType = createJobDto.PurchaseType ?? string.Empty,
                PropertyType = createJobDto.PropertyType,
                JourneyProgress = createJobDto.JourneyProgress,
                SelectedProfessionals = createJobDto.SelectedProfessionals,
                SuggestedProfessionalIds = createJobDto.SuggestedProfessionalIds,
                BudgetMin = createJobDto.BudgetMin,
                BudgetMax = createJobDto.BudgetMax,
                ContactEmail = createJobDto.ContactEmail,
                ContactPhone = createJobDto.ContactPhone
            }
        };
    }

    // JobDetail to JobDetailDto
    public JobDetailDto ToJobDetailDto(JobDetail jobDetail)
    {
        return new JobDetailDto
        {
            JobDetailId = jobDetail.JobDetailId,
            JobId = jobDetail.JobId,
            Postcode = jobDetail.Postcode,
            PurchaseType = jobDetail.PurchaseType,
            PropertyType = jobDetail.PropertyType,
            JourneyProgress = jobDetail.JourneyProgress,
            SelectedProfessionals = jobDetail.SelectedProfessionals,
            SuggestedProfessionalIds = jobDetail.SuggestedProfessionalIds,
            BudgetMin = jobDetail.BudgetMin,
            BudgetMax = jobDetail.BudgetMax,
            ContactEmail = jobDetail.ContactEmail,
            ContactPhone = jobDetail.ContactPhone,
            JobDetailProfessionalTypeIds = jobDetail.ProfessionalTypes.Select(p => p.ProfessionalTypeId).ToList()
        };
    }

    // JobDetailDto to JobDetail
    public JobDetail ToJobDetailEntity(JobDetailDto jobDetailDto)
    {
        return new JobDetail
        {
            JobDetailId = jobDetailDto.JobDetailId,
            JobId = jobDetailDto.JobId,
            Postcode = jobDetailDto.Postcode,
            PurchaseType = jobDetailDto.PurchaseType,
            PropertyType = jobDetailDto.PropertyType,
            JourneyProgress = jobDetailDto.JourneyProgress,
            SelectedProfessionals = jobDetailDto.SelectedProfessionals,
            SuggestedProfessionalIds = jobDetailDto.SuggestedProfessionalIds,
            BudgetMin = jobDetailDto.BudgetMin,
            BudgetMax = jobDetailDto.BudgetMax,
            ContactEmail = jobDetailDto.ContactEmail,
            ContactPhone = jobDetailDto.ContactPhone,
            ProfessionalTypes = jobDetailDto.JobDetailProfessionalTypeIds
                .Select(id => new ProfessionalType { ProfessionalTypeId = id }).ToList()
        };
    }
}