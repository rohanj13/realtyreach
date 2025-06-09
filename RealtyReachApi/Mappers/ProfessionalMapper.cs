using RealtyReachApi.Dtos;
using RealtyReachApi.Models;

namespace RealtyReachApi.Mappers;

public class ProfessionalMapper : IProfessionalMapper
{
    // Professional to ProfessionalDto
    public ProfessionalDto ToProfessionalDto(Professional professional)
    {
        return new ProfessionalDto
        {
            Id = professional.Id,
            Email = professional.Email,
            FirstName = professional.FirstName,
            LastName = professional.LastName,
            ABN = professional.ABN,
            LicenseNumber = professional.LicenseNumber,
            VerificationStatus = professional.VerificationStatus,
            CompanyName = professional.CompanyName,
            FirstLogin = professional.FirstLogin,
            ProfessionalTypeId = professional.ProfessionalTypeId,
            ProfessionalType = string.Empty, // This can be populated if you fetch the related ProfessionalType
            Regions = professional.Regions,
            States = professional.States,
            Specialisations = professional.Specialisations,
        };
    }

    // ProfessionalDto to Professional
    public Professional ToProfessionalEntity(ProfessionalDto professionalDto)
    {
        return new Professional
        {
            Id = professionalDto.Id,
            Email = professionalDto.Email,
            FirstName = professionalDto.FirstName,
            LastName = professionalDto.LastName,
            ABN = professionalDto.ABN,
            LicenseNumber = professionalDto.LicenseNumber,
            VerificationStatus = professionalDto.VerificationStatus,
            CompanyName = professionalDto.CompanyName,
            FirstLogin = professionalDto.FirstLogin,
            ProfessionalTypeId = professionalDto.ProfessionalTypeId,
            Regions = professionalDto.Regions,
            States = professionalDto.States,
            Specialisations = professionalDto.Specialisations
        };
    }
    
    public ProfessionalProfileDto ToProfileDto(Professional professional, ProfessionalType professionalType)
    {
        return new ProfessionalProfileDto
        {
            Id = professional.Id,
            Email = professional.Email,
            FirstName = professional.FirstName,
            LastName = professional.LastName,
            CompanyName = professional.CompanyName,
            ABN = professional.ABN,
            LicenseNumber = professional.LicenseNumber,
            VerificationStatus = professional.VerificationStatus,
            ProfessionalTypeName = professionalType.TypeName,
            ProfessionalTypeDescription = professionalType.Description,
            Regions = professional.Regions,
            States = professional.States,
            Specialisations = professional.Specialisations,
        };
    }
}