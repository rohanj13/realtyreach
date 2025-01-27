using RealtyReachApi.Models;

namespace RealtyReachApi.Dtos;

public class ProfessionalDto
{
    public Guid Id { get; set; }
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? ABN { get; set; }
    public string? LicenseNumber { get; set; }
    public bool VerificationStatus { get; set; }
    public string? CompanyName { get; set; }
    public bool? FirstLogin { get; set; }
    public int ProfessionalTypeId { get; set; }
    public string ProfessionalType { get; set; }
}

public class CreateProfessionalDto
{
    public Guid Id { get; set; }
    public required string Email { get; set; }
    public required string Type { get; set; }
}