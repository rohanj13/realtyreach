using RealtyReachApi.Dtos;
using RealtyReachApi.Models;

namespace RealtyReachApi.Services;

public interface IProfessionalService
{
    Task CreateProfessionalAsync(ProfessionalDto professional);
    Task<ProfessionalDto> GetProfessionalByIdAsync(Guid id);
    Task UpdateProfessionalAsync(Guid id, UpdateProfessionalDto updateDto);
    Task DeleteProfessionalAsync(Guid id);
    Task<IEnumerable<ProfessionalDto>> GetProfessionalsByTypeAsync(int professionalTypeId);
    Task<ProfessionalProfileDto?> GetProfessionalProfileAsync(Guid professionalId);
    Task VerifyProfessionalAsync(Guid professionalId);
    Task UnverifyProfessionalAsync(Guid professionalId);
}