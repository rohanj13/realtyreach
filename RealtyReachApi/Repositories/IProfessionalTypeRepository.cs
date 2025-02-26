using RealtyReachApi.Models;

namespace RealtyReachApi.Repositories;

public interface IProfessionalTypeRepository
{
    Task<ProfessionalType> GetProfessionalTypeByNameAsync(string typeName);
    Task<List<ProfessionalType>> GetProfessionalTypeByNamesAsync(List<string> typeNames);
}