using RealtyReachApi.Models;

namespace RealtyReachApi.Services;

public interface ICustomerService
{
    Task CreateCustomerAsync(CustomerDto customer);
    Task<CustomerDto> GetCustomerAsync(Guid id);
    Task UpdateCustomerAsync(CustomerDto customer);
    Task DeleteCustomerAsync(Guid id);
}
