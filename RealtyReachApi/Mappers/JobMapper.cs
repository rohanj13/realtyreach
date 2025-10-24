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

        /// <summary>
        /// Applies partial updates from UpdateJobDto to Job entity.
        /// Only updates fields that are non-null in the DTO.
        /// Follows SOLID principles: Single Responsibility (mapping only), Open/Closed (extensible).
        /// </summary>
        public void ApplyUpdateToEntity(UpdateJobDto updateDto, Job job)
        {
            if (updateDto == null || job == null)
                return;

            // Update Job-level properties if provided
            if (!string.IsNullOrEmpty(updateDto.JobTitle))
                job.JobTitle = updateDto.JobTitle;

            if (!string.IsNullOrEmpty(updateDto.JobType))
                job.JobType = updateDto.JobType;

            if (!string.IsNullOrEmpty(updateDto.AdditionalDetails))
                job.AdditionalDetails = updateDto.AdditionalDetails;

            // Update timestamp for audit trail
            job.UpdatedAt = DateTime.UtcNow;

            // Update JobDetail properties if provided (JobDetail should always exist)
            if (job.JobDetails != null)
            {
                if (updateDto.Regions != null)
                    job.JobDetails.Regions = updateDto.Regions;

                if (updateDto.States != null)
                    job.JobDetails.States = updateDto.States;

                if (updateDto.Specialisations != null)
                    job.JobDetails.Specialisations = updateDto.Specialisations;

                if (!string.IsNullOrEmpty(updateDto.PurchaseType))
                    job.JobDetails.PurchaseType = updateDto.PurchaseType;

                if (!string.IsNullOrEmpty(updateDto.PropertyType))
                    job.JobDetails.PropertyType = updateDto.PropertyType;

                if (updateDto.BudgetMin.HasValue)
                    job.JobDetails.BudgetMin = updateDto.BudgetMin.Value;

                if (updateDto.BudgetMax.HasValue)
                    job.JobDetails.BudgetMax = updateDto.BudgetMax.Value;

                if (!string.IsNullOrEmpty(updateDto.ContactEmail))
                    job.JobDetails.ContactEmail = updateDto.ContactEmail;

                if (!string.IsNullOrEmpty(updateDto.ContactPhone))
                    job.JobDetails.ContactPhone = updateDto.ContactPhone;
            }
        }
    }
}