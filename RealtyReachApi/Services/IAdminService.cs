using RealtyReachApi.Models;

namespace RealtyReachApi.Services;

public interface IAdminService
{
    Task CreateAdminAsync(Admin admin);
    Task<Admin> GetAdminAsync(Guid id);
    Task UpdateAdminAsync(Guid id, Admin admin);
    Task DeleteAdminAsync(Guid id);
}