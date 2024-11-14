using RealtyReachApi.Dtos;
using RealtyReachApi.Models;

namespace RealtyReachApi.Repositories;

public interface IProfessionalRepository
{
    Task AddAsync(Professional professional);
    Task<List<ProfessionalDto>> GetProfessionalsByProfessionalTypeIdsAsync(List<int> professionalTypeIds);
}