using Microsoft.EntityFrameworkCore;
using RealtyReachApi.Data;
using RealtyReachApi.Dtos;
using RealtyReachApi.Models;

namespace RealtyReachApi.Repositories;

public class ProfessionalRepository(SharedDbContext context) : IProfessionalRepository
{
    public async Task CreateProfessionalAsync(CreateProfessionalDto professional)
    {
        Professional? prof = new Professional();
        prof.Id = professional.Id;
        prof.Email = professional.Email;
        prof.ProfessionalTypeId = (int)Enum.Parse(typeof(ProfessionalType.ProfessionalTypeEnum), professional.Type);
        context.Professionals.Add(prof);
        await context.SaveChangesAsync();
    }

    public async Task<List<ProfessionalDto>> GetProfessionalsByProfessionalTypeIdsAsync(List<int> professionalTypeIds)
    {
        return await context.Professionals
            .Where(p => professionalTypeIds.Contains((int)p.ProfessionalTypeId))
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
                ProfessionalType = ((ProfessionalType.ProfessionalTypeEnum)p.ProfessionalTypeId).ToString()
            })
            .ToListAsync();
    }

    public Task<IEnumerable<Professional>> GetProfessionalsByTypeAsync(int professionalTypeId)
    {
        throw new NotImplementedException();
    }

    public async Task<ProfessionalDto> GetProfessionalByIdAsync(Guid professionalId)
    {
        Professional? professional = await context.Professionals.FindAsync(professionalId);
        ProfessionalDto professionalDto = new ProfessionalDto();
        if (professional != null)
        {
            professionalDto.Id = professional.Id;
            professionalDto.Email = professional.Email;
            professionalDto.FirstName = professional.FirstName;
            professionalDto.LastName = professional.LastName;
            professionalDto.ABN = professional.ABN;
            professionalDto.LicenseNumber = professional.LicenseNumber;
            professionalDto.VerificationStatus = professional.VerificationStatus;
            professionalDto.CompanyName = professional.CompanyName;
            professionalDto.FirstLogin = professional.FirstLogin;
            professionalDto.ProfessionalType =
                ((ProfessionalType.ProfessionalTypeEnum)professional.ProfessionalTypeId).ToString();
            return professionalDto;
        }

        return professionalDto;
    }

    public Task<bool> DeleteProfessionalAsync(ProfessionalDto professional)
    {
        throw new NotImplementedException();
    }
}