using RealtyReachApi.Dtos;
using RealtyReachApi.Models;

namespace RealtyReachApi.Mappers;

public interface IProfessionalMapper
{
    ProfessionalDto ToProfessionalDto(Professional professional);
    Professional ToProfessionalEntity(ProfessionalDto professionalDto);
    ProfessionalProfileDto ToProfileDto(Professional professional,  ProfessionalType professionalType);
    void ApplyUpdateToEntity(UpdateProfessionalDto updateDto, Professional professional);
}