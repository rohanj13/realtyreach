using RealtyReachApi.Data;
using RealtyReachApi.Interfaces;
using RealtyReachApi.Models;

public class AdminService : IAdminService
{
    private readonly SharedDbContext _context;

    public AdminService(SharedDbContext context)
    {
        _context = context;
    }

    public async Task CreateAdminAsync(Admin admin)
    {
        _context.Admins.Add(admin);
        await _context.SaveChangesAsync();
    }

    public async Task<Admin> GetAdminAsync(Guid id)
    {
        return await _context.Admins.FindAsync(id);
    }

    public async Task UpdateAdminAsync(Guid id, Admin updatedAdmin)
    {
        var admin = await _context.Admins.FindAsync(id);
        if (admin == null) return;

        admin.Email = updatedAdmin.Email;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAdminAsync(Guid id)
    {
        var admin = await _context.Admins.FindAsync(id);
        if (admin == null) return;

        _context.Admins.Remove(admin);
        await _context.SaveChangesAsync();
    }
}
