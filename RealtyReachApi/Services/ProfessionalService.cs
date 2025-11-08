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
    private readonly IProfessionalTypeRepository _professionalTypeRepository;
    public ProfessionalService(IProfessionalRepository professionalRepository, IProfessionalMapper mapper,
        IProfessionalTypeRepository professionalTypeRepository)
    {
        _repository = professionalRepository;
        _mapper = mapper;
        _professionalTypeRepository = professionalTypeRepository;
    }

    public async Task CreateProfessionalAsync(ProfessionalDto professional)
    {
        ProfessionalTypeEnum professionalTypeId = (ProfessionalTypeEnum)
            Enum.Parse(typeof(ProfessionalTypeEnum), professional.ProfessionalType);
        Professional p = _mapper.ToProfessionalEntity(professional);
        p.ProfessionalTypeId = (int)professionalTypeId;
        await _repository.CreateProfessionalAsync(p);
    }

    public async Task<ProfessionalDto> GetProfessionalByIdAsync(Guid id)
    {
        Professional professional = await _repository.GetProfessionalByIdAsync(id);
        ProfessionalDto profDto = _mapper.ToProfessionalDto(professional);
        return profDto;
    }

    /// <summary>
    /// Updates a professional's profile with partial data.
    /// Follows DDD principles: Domain logic encapsulation, aggregate boundaries.
    /// Implements SOLID: Single Responsibility (update orchestration), Dependency Inversion (uses interfaces).
    /// </summary>
    /// <param name="id">Professional's unique identifier</param>
    /// <param name="updateDto">DTO containing fields to update</param>
    /// <exception cref="KeyNotFoundException">Thrown when professional is not found</exception>
    /// <exception cref="ArgumentException">Thrown when professional type is invalid</exception>
    public async Task UpdateProfessionalAsync(Guid id, UpdateProfessionalDto updateDto)
    {
        // Retrieve existing professional entity (aggregate root)
        var professional = await _repository.GetProfessionalByIdAsync(id);

        if (professional == null)
        {
            throw new KeyNotFoundException($"Professional with ID {id} not found");
        }

        // Apply partial updates using mapper (separation of concerns)
        _mapper.ApplyUpdateToEntity(updateDto, professional);

        // Handle professional type update with validation (domain rule enforcement)
        if (!string.IsNullOrEmpty(updateDto.ProfessionalType))
        {
            if (Enum.TryParse<ProfessionalTypeEnum>(updateDto.ProfessionalType, out var typeEnum))
            {
                professional.ProfessionalTypeId = (int)typeEnum;
            }
            else
            {
                throw new ArgumentException(
                    $"Invalid professional type: '{updateDto.ProfessionalType}'. " +
                    "Valid types are: Advocate, Broker, Conveyancer, BuildAndPest");
            }
        }

        // Mark profile as completed (domain event - first login complete)
        professional.FirstLogin = false;

        // Persist changes to repository
        var success = await _repository.UpdateProfessionalAsync(professional);

        if (!success)
        {
            throw new InvalidOperationException("Failed to update professional profile");
        }
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

    public async Task<ProfessionalProfileDto?> GetProfessionalProfileAsync(Guid professionalId)
    {
        var professional = await _repository.GetProfessionalByIdAsync(professionalId);
        var professionalType = await _professionalTypeRepository.GetProfessionalTypeByIdAsync(professional.ProfessionalTypeId);
        //if (professional == null) return null;
        ProfessionalProfileDto profile = _mapper.ToProfileDto(professional, professionalType);
        return profile;
    }

    public async Task VerifyProfessionalAsync(Guid professionalId)
    {
        var professional = await _repository.GetProfessionalByIdAsync(professionalId);
        if (professional == null)
        {
            throw new KeyNotFoundException($"Professional with ID {professionalId} not found");
        }

        professional.VerificationStatus = true;

        var success = await _repository.UpdateProfessionalAsync(professional);
        if (!success)
        {
            throw new InvalidOperationException("Failed to verify professional");
        }
    }

    public async Task UnverifyProfessionalAsync(Guid professionalId)
    {
        var professional = await _repository.GetProfessionalByIdAsync(professionalId);
        if (professional == null)
        {
            throw new KeyNotFoundException($"Professional with ID {professionalId} not found");
        }

        professional.VerificationStatus = false;

        var success = await _repository.UpdateProfessionalAsync(professional);
        if (!success)
        {
            throw new InvalidOperationException("Failed to unverify professional");
        }
    }
}
