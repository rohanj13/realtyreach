using RealtyReachApi.Dtos;
using RealtyReachApi.Models;

namespace RealtyReachApi.Services;

public interface IProfessionalService
{
    Task CreateProfessionalAsync(CreateProfessionalDto professional);
    Task<Professional> GetProfessionalByIdAsync(Guid id);
    Task UpdateProfessionalAsync(Guid id, Professional professional);
    Task DeleteProfessionalAsync(Guid id);
    Task<IEnumerable<ProfessionalDto>> GetProfessionalsByTypeAsync(int professionalTypeId);
}