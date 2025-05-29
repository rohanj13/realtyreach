using Microsoft.EntityFrameworkCore;
using RealtyReachApi.Data;
using RealtyReachApi.Dtos;
using RealtyReachApi.Models;

namespace RealtyReachApi.Repositories;

public class ProfessionalRepository(SharedDbContext context) : IProfessionalRepository
{
    public async Task CreateProfessionalAsync(Professional professional)
    {
        context.Professionals.Add(professional);
        await context.SaveChangesAsync();
    }

    public async Task<List<Professional>> GetProfessionalsByProfessionalTypeIdsAsync(List<int> professionalTypeIds)
    {
        return await context.Professionals
            .Where(p => professionalTypeIds.Contains((int)p.ProfessionalTypeId))
            .Select(p => new Professional
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
                Regions = p.Regions,
                States = p.States,
                Specialisations = p.Specialisations,
            })
            .ToListAsync();
    }

    public Task<IEnumerable<Professional>> GetProfessionalsByTypeAsync(int professionalTypeId)
    {
        throw new NotImplementedException();
    }

    public async Task<Professional> GetProfessionalByIdAsync(Guid professionalId)
    {
        Professional? professional = await context.Professionals.FindAsync(professionalId);
        return professional;
        // ProfessionalDto professionalDto = new ProfessionalDto();
        // if (professional != null)
        // {
        //     professionalDto.Id = professional.Id;
        //     professionalDto.Email = professional.Email;
        //     professionalDto.FirstName = professional.FirstName;
        //     professionalDto.LastName = professional.LastName;
        //     professionalDto.ABN = professional.ABN;
        //     professionalDto.LicenseNumber = professional.LicenseNumber;
        //     professionalDto.VerificationStatus = professional.VerificationStatus;
        //     professionalDto.CompanyName = professional.CompanyName;
        //     professionalDto.FirstLogin = professional.FirstLogin;
        //     professionalDto.ProfessionalType =
        //         ((ProfessionalType.ProfessionalTypeEnum)professional.ProfessionalTypeId).ToString();
        //     return professionalDto;
        // }
        //
        // return professionalDto;
    }

    public Task<bool> DeleteProfessionalAsync(Professional professional)
    {
        throw new NotImplementedException();
    }
}