using RealtyReachApi.Data;
using RealtyReachApi.Dtos;
using RealtyReachApi.Mappers;
using RealtyReachApi.Models;
using RealtyReachApi.Repositories;
using static RealtyReachApi.Models.ProfessionalType;

namespace RealtyReachApi.Services;

public class ProfessionalService : IProfessionalService
{
    private readonly IProfessionalRepository _repository;
    private readonly IProfessionalMapper _mapper;
    public ProfessionalService(IProfessionalRepository professionalRepository, IProfessionalMapper mapper)
    {
        _repository = professionalRepository;
        _mapper = mapper;
    }

    public async Task CreateProfessionalAsync(ProfessionalDto professional)
    {
        //TODO: convert from professional dto to professional object
        ProfessionalTypeEnum professionalTypeId = (ProfessionalTypeEnum) Enum.Parse(typeof(ProfessionalTypeEnum), professional.ProfessionalType);
        Professional p = _mapper.ToProfessionalEntity(professional);
        p.ProfessionalTypeId = (int) professionalTypeId;
        // Professional prof = new Professional
        // {
        //     Id = professional.Id,
        //     Email = professional.Email,
        //     FirstLogin = professional.FirstLogin,
        //     ProfessionalTypeId = (int) professionalTypeId
        // };
        await _repository.CreateProfessionalAsync(p);
    }

    public async Task<ProfessionalDto> GetProfessionalByIdAsync(Guid id)
    {
        Professional professional = await _repository.GetProfessionalByIdAsync(id);
        //TODO: convert from professional to professional dto
        ProfessionalDto profDto = new ProfessionalDto();
        return profDto;
    }

    public async Task UpdateProfessionalAsync(Guid id, Professional updatedProfessional)
    {
        throw new NotImplementedException();
        /*
        var professional = await _context.Professionals.FindAsync(id);
        if (professional == null) return;

        professional.Email = updatedProfessional.Email;
        professional.FirstName = updatedProfessional.FirstName;
        professional.LastName = updatedProfessional.LastName;
        professional.ProfessionalTypeId = updatedProfessional.ProfessionalTypeId;
        professional.ABN = updatedProfessional.ABN;
        professional.LicenseNumber = updatedProfessional.LicenseNumber;
        professional.CompanyName = updatedProfessional.CompanyName;
        professional.FirstLogin = updatedProfessional.FirstLogin;
        await _context.SaveChangesAsync();
        */
    }

    public async Task DeleteProfessionalAsync(Guid id)
    {
        throw new NotImplementedException();
        // var professional = await _context.Professionals.FindAsync(id);
        // var professional = await _context.Professionals.FindAsync(id);
        // if (professional == null) return;
        //
        // _context.Professionals.Remove(professional);
        // await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<ProfessionalDto>> GetProfessionalsByTypeAsync(int professionalTypeId)
    {
        var professionals = await _repository.GetProfessionalsByTypeAsync(professionalTypeId);
        //TODO: convert professional list to professional dto list
        return new List<ProfessionalDto>();
    }
}
