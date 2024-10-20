using RealtyReachApi.Models;

public interface ICustomerService
{
    Task CreateCustomerAsync(Customer customer);
    Task<Customer> GetCustomerAsync(Guid id);
    Task UpdateCustomerAsync(Guid id, CustomerDto customer);
    Task DeleteCustomerAsync(Guid id);
}
