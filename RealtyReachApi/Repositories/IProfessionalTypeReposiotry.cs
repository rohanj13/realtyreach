using RealtyReachApi.Models;

namespace RealtyReachApi.Repositories;

public interface IProfessionalTypeReposiotry
{
    Task<ProfessionalType> GetProfessionalTypeByNameAsync(string typeName);
}