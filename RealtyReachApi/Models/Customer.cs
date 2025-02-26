using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace RealtyReachApi.Models;
public class Customer
{
    public Guid Id { get; set; }
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public bool FirstLogin { get; set; }
    public ICollection<Job> Jobs { get; } = new List<Job>();
}