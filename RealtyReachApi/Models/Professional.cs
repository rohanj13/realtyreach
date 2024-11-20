using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RealtyReachApi.Models;
public class Professional
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    // Foreign key to ProfessionalType
    public int ProfessionalTypeId { get; set; }
    public ProfessionalType ProfessionalType { get; set; } = null !;
    
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? ABN { get; set; } // Australian Business Number
    public string? LicenseNumber { get; set; }
    public bool VerificationStatus { get; set; } // True if verified, false otherwise
    public string? CompanyName { get; set; }
    
    
    // Professional to Job Link
    public List<JobProfessionalLink> JobProfessionalLinks { get; set; }
}