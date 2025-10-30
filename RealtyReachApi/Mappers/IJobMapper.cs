using RealtyReachApi.Dtos;
using RealtyReachApi.Models;

namespace RealtyReachApi.Mappers;

public interface IJobMapper
{
    JobDto ToJobDto(Job job);
    Job ToJobEntity(JobDto jobDto);
    Job ToJobEntity(CreateJobDto createJobDto, Guid customerId);
    JobDetailDto ToJobDetailDto(JobDetail jobDetail);
    JobDetail ToJobDetailEntity(JobDetailDto jobDetailDto);
    GetFinalisedJobDto ToGetFinalisedJobDto(JobProfessionalLink jobProfessionalLink);
    // Map Job -> JobInfoDto (lightweight job summary for dashboards)
    JobInfoDto ToJobInfoDto(Job job);
    // Map JobInfoDto -> Job entity (requires customerId for ownership)
    Job ToJobEntity(JobInfoDto jobInfoDto, Guid customerId);

    /// <summary>
    /// Applies partial updates from UpdateJobDto to Job entity.
    /// Only updates fields that are non-null in the DTO.
    /// Follows SOLID principles: Single Responsibility (mapping only), Open/Closed (extensible).
    /// </summary>
    void ApplyUpdateToEntity(UpdateJobDto updateDto, Job job);
}