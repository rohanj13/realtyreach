using RealtyReachApi.Data;
using RealtyReachApi.Mappers;
using RealtyReachApi.Models;
using RealtyReachApi.Repositories;
using RealtyReachApi.Services;

public class CustomerService : ICustomerService
{
    private readonly ICustomerRepository _customerRepository;
    private readonly ICustomerMapper _customerMapper;

    public CustomerService(ICustomerRepository customerRepository,  ICustomerMapper customerMapper)
    {
        _customerRepository = customerRepository;
        _customerMapper = customerMapper;
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
    
    public async Task<CustomerProfileDto?> GetCustomerProfileAsync(Guid customerId)
    {
        var customer = await _customerRepository.GetCustomerByIdAsync(customerId);
        if (customer == null) return null;
        CustomerProfileDto profile = _customerMapper.ToCustomerProfileDto(customer);
        
        return profile;
    }
}
