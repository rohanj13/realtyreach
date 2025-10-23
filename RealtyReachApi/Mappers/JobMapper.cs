using RealtyReachApi.Dtos;
using RealtyReachApi.Models;

using RealtyReachApi.Dtos;
using RealtyReachApi.Models;

namespace RealtyReachApi.Mappers
{
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
                //SuburbIds = job.JobDetails?.SuburbIds
                Regions = job.JobDetails?.Regions,
                States = job.JobDetails?.States,
                Specialisations = job.JobDetails?.Specialisations,
                PurchaseType = job.JobDetails?.PurchaseType ?? string.Empty,
                PropertyType = job.JobDetails?.PropertyType ?? string.Empty,
                JourneyProgress = job.JobDetails?.JourneyProgress ?? string.Empty,
                SelectedProfessionals = job.JobDetails?.SelectedProfessionals ?? Array.Empty<string>(),
                SuggestedProfessionalIds = job.JobDetails?.SuggestedProfessionalIds ?? Array.Empty<Guid>(),
                Status = job.Status.ToString(),
                BudgetMin = job.JobDetails?.BudgetMin ?? 0,
                BudgetMax = job.JobDetails?.BudgetMax ?? 0,
                ContactEmail = job.JobDetails?.ContactEmail ?? string.Empty,
                ContactPhone = job.JobDetails?.ContactPhone ?? string.Empty,
                AdditionalDetails = job.AdditionalDetails,
                CreatedAt = job.CreatedAt,
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
                Status = Enum.Parse<JobStatus>(jobDto.Status),
                JobDetails = new JobDetail
                {
                    //SuburbIds = jobDto.SuburbIds,
                    Regions = jobDto.Regions,
                    States = jobDto.States,
                    PurchaseType = jobDto.PurchaseType,
                    PropertyType = jobDto.PropertyType,
                    JourneyProgress = jobDto.JourneyProgress,
                    SelectedProfessionals = jobDto.SelectedProfessionals,
                    Specialisations = jobDto.Specialisations,
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
                    //SuburbIds = createJobDto.SuburbIds,
                    Regions = createJobDto.Regions,
                    States = createJobDto.States,
                    Specialisations = createJobDto.Specialisations,
                    PurchaseType = createJobDto.PurchaseType ?? string.Empty,
                    PropertyType = createJobDto.PropertyType,
                    JourneyProgress = createJobDto.JourneyProgress,
                    SelectedProfessionals = createJobDto.SelectedProfessionals,
                    //SuggestedProfessionalIds = createJobDto.SuggestedProfessionalIds,
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
                //SuburbIds = jobDetail.SuburbIds,
                Regions = jobDetail.Regions,
                States = jobDetail.States,
                Specialisations = jobDetail.Specialisations,
                PurchaseType = jobDetail.PurchaseType,
                PropertyType = jobDetail.PropertyType,
                JourneyProgress = jobDetail.JourneyProgress,
                SelectedProfessionals = jobDetail.SelectedProfessionals,
                //SuggestedProfessionalIds = jobDetail.SuggestedProfessionalIds,
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
                //SuburbIds = jobDetailDto.SuburbIds,
                Regions = jobDetailDto.Regions,
                States = jobDetailDto.States,
                Specialisations = jobDetailDto.Specialisations,
                PurchaseType = jobDetailDto.PurchaseType,
                PropertyType = jobDetailDto.PropertyType,
                JourneyProgress = jobDetailDto.JourneyProgress,
                SelectedProfessionals = jobDetailDto.SelectedProfessionals,
                //SuggestedProfessionalIds = jobDetailDto.SuggestedProfessionalIds,
                BudgetMin = jobDetailDto.BudgetMin,
                BudgetMax = jobDetailDto.BudgetMax,
                ContactEmail = jobDetailDto.ContactEmail,
                ContactPhone = jobDetailDto.ContactPhone,
                ProfessionalTypes = jobDetailDto.JobDetailProfessionalTypeIds
                    .Select(id => new ProfessionalType { ProfessionalTypeId = id }).ToList()
            };
        }

        // JobProfessionalLink to GetFinalisedJobDto
        public GetFinalisedJobDto ToGetFinalisedJobDto(JobProfessionalLink jobProfessionalLink)
        {
            return new GetFinalisedJobDto
            {
                JobId = jobProfessionalLink.JobDetail?.Job?.JobId ?? 0,
                Title = jobProfessionalLink.JobDetail?.Job?.JobTitle ?? string.Empty,
                JobType = jobProfessionalLink.JobDetail?.Job?.JobType ?? string.Empty,
                Status = jobProfessionalLink.JobDetail?.Job?.Status.ToString() ?? string.Empty,
                Region = jobProfessionalLink.JobDetail?.Regions?.FirstOrDefault() ?? string.Empty,
                State = jobProfessionalLink.JobDetail?.States != null && jobProfessionalLink.JobDetail.States.Count > 0
                    ? jobProfessionalLink.JobDetail.States[0].ToString()
                    : string.Empty,
                Specialisation = jobProfessionalLink.JobDetail?.Specialisations != null && jobProfessionalLink.JobDetail.Specialisations.Count > 0
                    ? jobProfessionalLink.JobDetail.Specialisations[0].ToString()
                    : string.Empty,
                PurchaseType = jobProfessionalLink.JobDetail?.PurchaseType ?? string.Empty,
                PropertyType = jobProfessionalLink.JobDetail?.PropertyType ?? string.Empty,
                CustomerEmail = jobProfessionalLink.JobDetail?.ContactEmail ?? string.Empty,
                CustomerPhone = jobProfessionalLink.JobDetail?.ContactPhone ?? string.Empty,
                AssignedDate = jobProfessionalLink.AssignedDate
            };
        }

        // Job -> JobInfoDto (lightweight summary used in listings)
        public JobInfoDto ToJobInfoDto(Job job)
        {
            if (job == null) return null!; // caller should guard, but keep for safety

            return new JobInfoDto
            {
                JobId = job.JobId,
                JobType = job.JobType,
                JobTitle = job.JobTitle,
                Regions = job.JobDetails?.Regions,
                States = job.JobDetails?.States,
                Specialisations = job.JobDetails?.Specialisations,
                PurchaseType = job.JobDetails?.PurchaseType ?? string.Empty,
                PropertyType = job.JobDetails?.PropertyType ?? string.Empty,
                JourneyProgress = job.JobDetails?.JourneyProgress ?? string.Empty,
                Status = job.Status.ToString(),
                BudgetMin = job.JobDetails?.BudgetMin ?? 0,
                BudgetMax = job.JobDetails?.BudgetMax ?? 0,
                ContactEmail = job.JobDetails?.ContactEmail ?? string.Empty,
                ContactPhone = job.JobDetails?.ContactPhone ?? string.Empty,
                AdditionalDetails = job.AdditionalDetails ?? string.Empty,
                CreatedAt = job.CreatedAt
            };
        }

        // JobInfoDto -> Job entity. Note: requires customerId to set ownership.
        public Job ToJobEntity(JobInfoDto jobInfoDto, Guid customerId)
        {
            if (jobInfoDto == null) return null!;

            return new Job
            {
                JobId = jobInfoDto.JobId,
                CustomerId = customerId,
                JobTitle = jobInfoDto.JobTitle,
                JobType = jobInfoDto.JobType,
                AdditionalDetails = jobInfoDto.AdditionalDetails ?? string.Empty,
                Status = Enum.TryParse<JobStatus>(jobInfoDto.Status, out var parsedStatus) ? parsedStatus : JobStatus.Open,
                CreatedAt = jobInfoDto.CreatedAt,
                JobDetails = new JobDetail
                {
                    Regions = jobInfoDto.Regions,
                    States = jobInfoDto.States,
                    Specialisations = jobInfoDto.Specialisations,
                    PurchaseType = jobInfoDto.PurchaseType ?? string.Empty,
                    PropertyType = jobInfoDto.PropertyType ?? string.Empty,
                    JourneyProgress = jobInfoDto.JourneyProgress ?? string.Empty,
                    SelectedProfessionals = Array.Empty<string>(),
                    BudgetMin = jobInfoDto.BudgetMin,
                    BudgetMax = jobInfoDto.BudgetMax,
                    ContactEmail = jobInfoDto.ContactEmail ?? string.Empty,
                    ContactPhone = jobInfoDto.ContactPhone ?? string.Empty,
                    SuggestedProfessionalIds = Array.Empty<Guid>()
                }
            };
        }
    }
}