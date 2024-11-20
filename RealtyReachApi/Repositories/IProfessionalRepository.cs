using RealtyReachApi.Dtos;
using RealtyReachApi.Models;

namespace RealtyReachApi.Repositories;

public interface IProfessionalRepository
{
    Task CreateProfessionalAsync(CreateProfessionalDto professional);
    Task<List<ProfessionalDto>> GetProfessionalsByProfessionalTypeIdsAsync(List<int> professionalTypeIds);
    Task<IEnumerable<Professional>> GetProfessionalsByTypeAsync(int professionalTypeId);
    Task<Professional> GetProfessionalByIdAsync(int professionalId);
    Task<bool> DeleteProfessionalAsync(ProfessionalDto professional);
}