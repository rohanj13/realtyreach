using RealtyReachApi.Data;
using RealtyReachApi.Models;
using RealtyReachApi.Repositories;
using RealtyReachApi.Services;

public class CustomerService : ICustomerService
{
    private readonly ICustomerRepository _customerRepository;

    public CustomerService(ICustomerRepository customerRepository)
    {
        _customerRepository = customerRepository;
    }

    public async Task CreateCustomerAsync(CustomerDto customer)
    {
        Customer cus = new Customer
        {
            Id = customer.Id,
            Email = customer.Email,
            FirstLogin = customer.FirstLogin
        };
        await _customerRepository.CreateCustomerAsync(cus);
    }

    public async Task<CustomerDto> GetCustomerAsync(Guid id)
    {
        var c = await _customerRepository.GetCustomerByIdAsync(id);
        
        if (c == null)
        {
            return null;
        }
        else
        {
            CustomerDto cDto = new CustomerDto
            {
                Email = c.Email,
                FirstName = c.FirstName,
                LastName = c.LastName
            };
            return cDto;
        }

    }

    public async Task UpdateCustomerAsync(CustomerDto updatedCustomer, Guid customerId)
    {
        Customer c = new Customer
        {
            Id = customerId,
            FirstName = updatedCustomer.FirstName,
            LastName = updatedCustomer.LastName,
            FirstLogin = updatedCustomer.FirstLogin,
            Email = updatedCustomer.Email
        };
        await _customerRepository.UpdateCustomerAsync(c);
    }

    public async Task DeleteCustomerAsync(Guid id)
    {
        await _customerRepository.DeleteCustomerAsync(id);
    }
}
