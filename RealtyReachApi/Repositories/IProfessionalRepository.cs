using RealtyReachApi.Models;

namespace RealtyReachApi.Repositories;

public interface IProfessionalRepository
{
    Task CreateProfessionalAsync(Professional professional);
    Task<List<Professional>> GetProfessionalsByProfessionalTypeIdsAsync(List<int> professionalTypeIds);
    Task<IEnumerable<Professional>> GetProfessionalsByTypeAsync(int professionalTypeId);
    Task<Professional> GetProfessionalByIdAsync(Guid professionalId);
    Task<bool> UpdateProfessionalAsync(Professional professional);
    Task<bool> DeleteProfessionalAsync(Professional professional);
}