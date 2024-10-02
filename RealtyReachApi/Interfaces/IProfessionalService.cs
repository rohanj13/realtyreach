using RealtyReachApi.Models;

public interface IProfessionalService
{
    Task CreateProfessionalAsync(Professional professional);
    Task<Professional> GetProfessionalAsync(Guid id);
    Task UpdateProfessionalAsync(Guid id, Professional professional);
    Task DeleteProfessionalAsync(Guid id);
}