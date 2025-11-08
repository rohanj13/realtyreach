using RealtyReachApi.Dtos;
using RealtyReachApi.Models;

namespace RealtyReachApi.Services;

public interface IAdminService
{
    Task CreateAdminAsync(Admin admin);
    Task<Admin> GetAdminAsync(Guid id);
    Task UpdateAdminAsync(Guid id, Admin admin);
    Task DeleteAdminAsync(Guid id);
    Task<List<ProfessionalDto>> GetAllProfessionalsAsync();
    Task<List<CustomerDto>> GetAllCustomersAsync();
    Task<List<JobDto>> GetAllJobsAsync();
}