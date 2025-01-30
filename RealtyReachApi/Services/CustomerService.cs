using RealtyReachApi.Data;
using RealtyReachApi.Mappers;
using RealtyReachApi.Models;
using RealtyReachApi.Repositories;
using RealtyReachApi.Services;

public class CustomerService : ICustomerService
{
    private readonly ICustomerRepository _customerRepository;
    private readonly Mapper _mapper;

    public CustomerService(ICustomerRepository customerRepository, Mapper mapper)
    {
        _customerRepository = customerRepository;
        _mapper = mapper;
    }

    public async Task CreateCustomerAsync(CustomerDto customerDto)
    {
        Customer c = _mapper.ToCustomerEntity(customerDto);
        await _customerRepository.CreateCustomerAsync(c);
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
            CustomerDto cDto = _mapper.ToCustomerDto(c);
            return cDto;
        }

    }

    public async Task UpdateCustomerAsync(CustomerDto updatedCustomer)
    {
        Customer c = _mapper.ToCustomerEntity(updatedCustomer);
        await _customerRepository.UpdateCustomerAsync(c);
    }

    public async Task DeleteCustomerAsync(Guid id)
    {
        await _customerRepository.DeleteCustomerAsync(id);
    }
}
