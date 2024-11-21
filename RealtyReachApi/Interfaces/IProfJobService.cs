namespace RealtyReachApi.Interfaces
{
    public interface IProfJobService
    {
        Task<List<JobDto>> GetApplicableJobsForProfessional(int professionalId);
    }
}
