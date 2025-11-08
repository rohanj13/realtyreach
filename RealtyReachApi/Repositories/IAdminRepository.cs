using RealtyReachApi.Models;

namespace RealtyReachApi.Repositories;

public interface IAdminRepository
{
    Task CreateAdminAsync(Admin admin);
    Task<Admin> GetAdminAsync(Guid id);
    Task UpdateAdminAsync(Guid id, Admin updatedAdmin);
    Task DeleteAdminAsync(Guid id);
}