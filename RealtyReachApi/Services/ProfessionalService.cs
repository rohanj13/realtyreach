using RealtyReachApi.Data;
using RealtyReachApi.Interfaces;
using RealtyReachApi.Models;

public class ProfessionalService : IProfessionalService
{
    private readonly SharedDbContext _context;

    public ProfessionalService(SharedDbContext context)
    {
        _context = context;
    }

    public async Task CreateProfessionalAsync(Professional professional)
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
}
