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
}