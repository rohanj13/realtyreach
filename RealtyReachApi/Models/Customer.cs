using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TypeGen.Core.TypeAnnotations;

namespace RealtyReachApi.Models;
[ExportTsClass]
public class Customer
{
    //add a constructor
    public Customer(Guid id, string? email)
    {
        Id = id;
        Email = email;
        this.FirstLogin = true;
    }

    public Guid Id { get; set; }
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public bool FirstLogin { get; set; }
    public ICollection<Job> Jobs { get; } = new List<Job>();
}