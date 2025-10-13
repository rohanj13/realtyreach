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

    /// <summary>
    /// Applies partial updates from UpdateProfessionalDto to Professional entity.
    /// Only updates fields that are non-null in the DTO.
    /// Follows SOLID principles: Single Responsibility (mapping only), Open/Closed (extensible).
    /// </summary>
    public void ApplyUpdateToEntity(UpdateProfessionalDto updateDto, Professional professional)
    {
        // Update basic information fields if provided
        if (!string.IsNullOrEmpty(updateDto.FirstName))
            professional.FirstName = updateDto.FirstName;

        if (!string.IsNullOrEmpty(updateDto.LastName))
            professional.LastName = updateDto.LastName;

        if (!string.IsNullOrEmpty(updateDto.CompanyName))
            professional.CompanyName = updateDto.CompanyName;

        if (!string.IsNullOrEmpty(updateDto.ABN))
            professional.ABN = updateDto.ABN;

        if (!string.IsNullOrEmpty(updateDto.LicenseNumber))
            professional.LicenseNumber = updateDto.LicenseNumber;

        // Update service areas if provided
        if (updateDto.Regions != null)
            professional.Regions = updateDto.Regions;

        if (updateDto.States != null)
            professional.States = updateDto.States;

        if (updateDto.Specialisations != null)
            professional.Specialisations = updateDto.Specialisations;
    }
}