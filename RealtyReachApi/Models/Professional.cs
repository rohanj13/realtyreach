using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RealtyReachApi.Models;
public class Professional
{
    public Guid Id { get; set; }
    public int ProfessionalTypeId { get; set; } // Foreign Key
    
    // Navigation properties
    public ProfessionalType ProfessionalType { get; set; }
    public ICollection<JobProfessionalLink> JobProfessionalLinks { get; set; } = new List<JobProfessionalLink>();
    
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? ABN { get; set; } // Australian Business Number
    public string? LicenseNumber { get; set; }
    public bool VerificationStatus { get; set; } // True if verified, false otherwise
    public string? CompanyName { get; set; }
}