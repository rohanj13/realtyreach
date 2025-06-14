using RealtyReachApi.Models;

namespace RealtyReachApi.Mappers;

public class CustomerMapper : ICustomerMapper
{
    // Customer to CustomerDto
    public CustomerDto ToCustomerDto(Customer customer)
    {
        return new CustomerDto
        {
            Id = customer.Id,
            Email = customer.Email ?? string.Empty,
            FirstName = customer.FirstName ?? string.Empty,
            LastName = customer.LastName ?? string.Empty,
            FirstLogin = customer.FirstLogin
        };
    }

    // CustomerDto to Customer
    public Customer ToCustomerEntity(CustomerDto customerDto)
    {
        return new Customer
        {
            Id = customerDto.Id,
            Email = customerDto.Email,
            FirstName = customerDto.FirstName,
            LastName = customerDto.LastName,
            FirstLogin = customerDto.FirstLogin
        };
    }
    public CustomerProfileDto ToCustomerProfileDto(Customer customer)
    {
        return new CustomerProfileDto
        {
            Id = customer.Id,
            Email = customer.Email,
            FirstName = customer.FirstName,
            LastName = customer.LastName,
        };
    }

    public Customer ToCustomerEntity(CustomerProfileDto dto)
    {
        return new Customer
        {
            Id = dto.Id,
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
        };
    }
}