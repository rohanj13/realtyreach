using RealtyReachApi.Data;
using RealtyReachApi.Models;
using RealtyReachApi.Services;

public class CustomerService : ICustomerService
{
    private readonly SharedDbContext _context;

    public CustomerService(SharedDbContext context)
    {
        _context = context;
    }

    public async Task CreateCustomerAsync(Customer customer)
    {
        //use a dto as an argument here
        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();
        Console.WriteLine("added to db");
    }

    public async Task<Customer> GetCustomerAsync(Guid id)
    {
        return await _context.Customers.FindAsync(id);
    }

    public async Task UpdateCustomerAsync(Guid id, CustomerDto updatedCustomer)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return;

        customer.Email = updatedCustomer.Email;
        customer.FirstName = updatedCustomer.FirstName;
        customer.LastName = updatedCustomer.LastName;
        customer.FirstLogin = updatedCustomer.FirstLogin;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteCustomerAsync(Guid id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return;

        _context.Customers.Remove(customer);
        await _context.SaveChangesAsync();
    }
}
