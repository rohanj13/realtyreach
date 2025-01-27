using RealtyReachApi.Data;
using RealtyReachApi.Dtos;
using RealtyReachApi.Models;
using RealtyReachApi.Repositories;

namespace RealtyReachApi.Services;

public class ProfessionalService : IProfessionalService
{
    private readonly SharedDbContext _context;
    private readonly IProfessionalRepository _repository;

    public ProfessionalService(SharedDbContext context, IProfessionalRepository professionalRepository)
    {
        _context = context;
        _repository = professionalRepository;
    }

    public async Task CreateProfessionalAsync(CreateProfessionalDto professional)
    {
        await _repository.CreateProfessionalAsync(professional);
    }

    public async Task<ProfessionalDto> GetProfessionalByIdAsync(Guid id)
    {
        ProfessionalDto professional = await _repository.GetProfessionalByIdAsync(id);
        return professional;
    }

    public async Task CreateProfessionalNoRepoAsync(Professional? professional)
    {
        _context.Professionals.Add(professional);
        await _context.SaveChangesAsync();
    }

    public async Task<Professional> GetProfessionalAsync(Guid id)
    {
        return await _context.Professionals.FindAsync(id);
    }

    public async Task UpdateProfessionalAsync(Guid id, Professional updatedProfessional)
    {
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
    }

    public async Task DeleteProfessionalAsync(Guid id)
    {
        var professional = await _context.Professionals.FindAsync(id);
        if (professional == null) return;

        _context.Professionals.Remove(professional);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<ProfessionalDto>> GetProfessionalsByTypeAsync(int professionalTypeId)
    {
        var professionals = await _repository.GetProfessionalsByTypeAsync(professionalTypeId);
        return new List<ProfessionalDto>();
    }
}
