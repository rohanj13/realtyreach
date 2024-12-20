using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RealtyReachApi.Models;
public class Professional
{
    public Guid Id { get; set; }
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? ABN { get; set; } // Australian Business Number
    public string? LicenseNumber { get; set; }
    public bool VerificationStatus { get; set; } // True if verified, false otherwise
    public string? CompanyName { get; set; }
}