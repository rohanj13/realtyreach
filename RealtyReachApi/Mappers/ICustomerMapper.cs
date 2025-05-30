using RealtyReachApi.Models;

namespace RealtyReachApi.Mappers;

public interface ICustomerMapper
{
    CustomerDto ToCustomerDto(Customer customer);
    Customer ToCustomerEntity(CustomerDto customerDto);
    CustomerProfileDto ToCustomerProfileDto(Customer customer);
    Customer ToCustomerEntity(CustomerProfileDto customerDto);
}