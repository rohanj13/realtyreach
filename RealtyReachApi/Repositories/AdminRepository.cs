using Microsoft.EntityFrameworkCore;
using RealtyReachApi.Data;
using RealtyReachApi.Models;

namespace RealtyReachApi.Repositories;

public class AdminRepository(SharedDbContext context) : IAdminRepository
{
    public async Task CreateAdminAsync(Admin admin)
    {
        context.Admins.Add(admin);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAdminAsync(Guid id)
    {
        var admin = await context.Admins.FindAsync(id);
        if (admin == null) return;

        context.Admins.Remove(admin);
        await context.SaveChangesAsync();
    }

    public async Task<Admin> GetAdminAsync(Guid id)
    {
        return await context.Admins.FindAsync(id);
    }
    public async Task UpdateAdminAsync(Guid id, Admin updatedAdmin)
    {
        var admin = await context.Admins.FindAsync(id);
        if (admin == null) return;

        admin.Email = updatedAdmin.Email;
        await context.SaveChangesAsync();
    }
}