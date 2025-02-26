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
        ProfessionalTypeEnum professionalTypeId = (ProfessionalTypeEnum) Enum.Parse(typeof(ProfessionalTypeEnum), professional.ProfessionalType);
        Professional p = _mapper.ToProfessionalEntity(professional);
        p.ProfessionalTypeId = (int) professionalTypeId;
        await _repository.CreateProfessionalAsync(p);
    }

    public async Task<ProfessionalDto> GetProfessionalByIdAsync(Guid id)
    {
        Professional professional = await _repository.GetProfessionalByIdAsync(id);
        ProfessionalDto profDto = _mapper.ToProfessionalDto(professional);
        return profDto;
    }

    public async Task UpdateProfessionalAsync(Guid id, Professional updatedProfessional)
    {
        throw new NotImplementedException();
    }

    public async Task DeleteProfessionalAsync(Guid id)
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<ProfessionalDto>> GetProfessionalsByTypeAsync(int professionalTypeId)
    {
        var professionals = await _repository.GetProfessionalsByTypeAsync(professionalTypeId);
        List<ProfessionalDto> professionalDtos = new List<ProfessionalDto>();
        foreach (var professional in professionals)
            professionalDtos.Add(_mapper.ToProfessionalDto(professional));
        return professionalDtos;
    }
}
