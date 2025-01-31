using RealtyReachApi.Models;

namespace RealtyReachApi.Services;

public interface ICustomerService
{
    Task CreateCustomerAsync(CustomerDto customer);
    Task<CustomerDto> GetCustomerAsync(Guid id);
    Task UpdateCustomerAsync(CustomerDto customer, Guid customerId);
    Task DeleteCustomerAsync(Guid id);
}
