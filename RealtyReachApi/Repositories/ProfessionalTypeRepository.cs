using Microsoft.EntityFrameworkCore;
using RealtyReachApi.Data;
using RealtyReachApi.Models;

namespace RealtyReachApi.Repositories;

public class ProfessionalTypeRepository : IProfessionalTypeRepository
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
    public async Task<List<ProfessionalType>> GetProfessionalTypeByNamesAsync(List<string> typeNames)
    {
        return await _context.ProfessionalTypes
            .Where(pt => typeNames.Contains(pt.TypeName))
            .ToListAsync();

    }
}