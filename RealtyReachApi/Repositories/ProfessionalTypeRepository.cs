using Microsoft.EntityFrameworkCore;
using RealtyReachApi.Data;
using RealtyReachApi.Models;

namespace RealtyReachApi.Repositories;

public class ProfessionalTypeRepository : IProfessionalTypeReposiotry
{
    private readonly SharedDbContext _context;

    public ProfessionalTypeRepository(SharedDbContext context)
    {
        _context = context;
    }
    public async Task<ProfessionalType> GetProfessionalTypeByNameAsync(string typeName)
    {
        throw new NotImplementedException();
    }
}