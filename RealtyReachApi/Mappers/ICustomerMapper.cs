using RealtyReachApi.Models;

namespace RealtyReachApi.Mappers;

public interface ICustomerMapper
{
    CustomerDto ToCustomerDto(Customer customer);
    Customer ToCustomerEntity(CustomerDto customerDto);
}