using RealtyReachApi.Dtos;
using RealtyReachApi.Models;

namespace RealtyReachApi.Services;

public interface IProfessionalService
{
    Task CreateProfessionalAsync(ProfessionalDto professional);
    Task<ProfessionalDto> GetProfessionalByIdAsync(Guid id);
    Task UpdateProfessionalAsync(Guid id, Professional professional);
    Task DeleteProfessionalAsync(Guid id);
    Task<IEnumerable<ProfessionalDto>> GetProfessionalsByTypeAsync(int professionalTypeId);
    Task<ProfessionalProfileDto?> GetProfessionalProfileAsync(Guid professionalId);
}