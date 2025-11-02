using RealtyReachApi.Models;

namespace RealtyReachApi.Repositories;

public interface ICustomerRepository
{
    Task CreateCustomerAsync(Customer customer);
    Task<List<Customer>> GetAllCustomersAsync();
    Task<Customer?> GetCustomerByIdAsync(Guid customerId);
    Task UpdateCustomerAsync(Customer customer);
    Task<bool> DeleteCustomerAsync(Guid customerId);
}