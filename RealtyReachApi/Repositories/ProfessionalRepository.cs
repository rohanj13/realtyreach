using Microsoft.EntityFrameworkCore;
using RealtyReachApi.Data;
using RealtyReachApi.Dtos;
using RealtyReachApi.Models;

namespace RealtyReachApi.Repositories;

public class ProfessionalRepository(SharedDbContext context) : IProfessionalRepository
{
    public async Task AddAsync(CreateProfessionalDto professional)
    {
        Professional prof = new Professional
        {
            Id = professional.Id,
            Email = professional.Email,
            ProfessionalTypeId = (int)Enum.Parse(typeof(ProfessionalType.ProfessionalTypeEnum),professional.Type)
        };
        context.Professionals.Add(prof);
        await context.SaveChangesAsync();
    }

    public Task CreateProfessionalAsync(CreateProfessionalDto professional)
    {
        throw new NotImplementedException();
    }

    public async Task<List<ProfessionalDto>> GetProfessionalsByProfessionalTypeIdsAsync(List<int> professionalTypeIds)
    {
        return await context.Professionals
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

    public Task<IEnumerable<Professional>> GetProfessionalsByTypeAsync(int professionalTypeId)
    {
        throw new NotImplementedException();
    }

    public Task<Professional> GetProfessionalByIdAsync(int professionalId)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteProfessionalAsync(ProfessionalDto professional)
    {
        throw new NotImplementedException();
    }
}