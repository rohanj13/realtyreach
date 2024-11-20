using RealtyReachApi.Models;

namespace RealtyReachApi.Services;

public interface ICustomerService
{
    Task CreateCustomerAsync(Customer customer);
    Task<Customer> GetCustomerAsync(Guid id);
    Task UpdateCustomerAsync(Guid id, Customer customer);
    Task DeleteCustomerAsync(Guid id);
}