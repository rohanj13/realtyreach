using Microsoft.EntityFrameworkCore;
using RealtyReachApi.Data;
using RealtyReachApi.Dtos;
using RealtyReachApi.Models;

namespace RealtyReachApi.Repositories;

public class ProfessionalRepository : IProfessionalRepository
{
    private readonly SharedDbContext _context;

    public ProfessionalRepository(SharedDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Professional professional)
    {
        _context.Professionals.Add(professional);
        await _context.SaveChangesAsync();
    }

    public async Task<List<ProfessionalDto>> GetProfessionalsByProfessionalTypeIdsAsync(List<int> professionalTypeIds)
    {
        return await _context.Professionals
            .Where(p => professionalTypeIds.Contains(p.ProfessionalTypeId))
            .Select(p => new ProfessionalDto
            {
                Id = p.Id,
                Email = p.Email,
                FirstName = p.FirstName,
                LastName = p.LastName,
                ABN = p.ABN,
                LicenseNumber = p.LicenseNumber,
                VerificationStatus = p.VerificationStatus,
                CompanyName = p.CompanyName,
                ProfessionalTypeId = p.ProfessionalTypeId,
                ProfessionalType = p.ProfessionalType.TypeName
            })
            .ToListAsync();
    }
}