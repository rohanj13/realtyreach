using Microsoft.EntityFrameworkCore;
using RealtyReachApi.Data;
using RealtyReachApi.Models;

namespace RealtyReachApi.Repositories;

public class CustomerRepository(SharedDbContext context) : ICustomerRepository
{
    public async Task CreateCustomerAsync(Customer customer)
    {
        context.Customers.Add(customer);
        await context.SaveChangesAsync();
        Console.WriteLine("added to db");
    }
    public async Task<List<Customer>> GetAllCustomersAsync()
    {
        return await context.Customers.ToListAsync();
    }
    public async Task<Customer?> GetCustomerByIdAsync(Guid id)
    {
        return await context.Customers.FindAsync(id);
    }

    public async Task UpdateCustomerAsync(Customer updatedCustomer)
    {
        // Fetch the customer from the database
        var customer = await context.Customers.FindAsync(updatedCustomer.Id);

        // Check if the customer exists
        if (customer == null)
        {
            throw new KeyNotFoundException($"Customer with ID {updatedCustomer.Id} not found.");
        }

        // Update the properties of the existing customer
        customer.Email = updatedCustomer.Email;
        customer.FirstName = updatedCustomer.FirstName;
        customer.LastName = updatedCustomer.LastName;
        customer.FirstLogin = updatedCustomer.FirstLogin;

        // Save changes to the database
        await context.SaveChangesAsync();
    }


    public async Task<bool> DeleteCustomerAsync(Guid id)
    {
        var customer = await context.Customers.FindAsync(id);
        if (customer == null) return false;

        context.Customers.Remove(customer);
        await context.SaveChangesAsync();
        return true;
    }
}