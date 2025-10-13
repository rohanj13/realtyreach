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
    public List<string> Regions { get; set; }
    public List<AustralianState> States { get; set; }
    public List<Specialisation> Specialisations { get; set; }
}

public class ScoredProfessionalDto
{
    public Professional Professional { get; set; }
    public int Score { get; set; }
}

public class ProfessionalProfileDto
{
    public Guid Id { get; set; }
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }

    public string? CompanyName { get; set; }
    public string? ABN { get; set; }
    public string? LicenseNumber { get; set; }
    public bool VerificationStatus { get; set; }

    public string? ProfessionalTypeName { get; set; }
    
    public string? ProfessionalTypeDescription { get; set; }
    public List<string>? Regions { get; set; }
    public List<AustralianState>? States { get; set; }
    public List<Specialisation>? Specialisations { get; set; }
    
}

/// <summary>
/// DTO for updating professional profile information.
/// All fields are optional to support partial updates.
/// Used during profile completion and profile editing.
/// </summary>
public class UpdateProfessionalDto
{
    /// <summary>
    /// Professional's first name
    /// </summary>
    public string? FirstName { get; set; }
    
    /// <summary>
    /// Professional's last name
    /// </summary>
    public string? LastName { get; set; }
    
    /// <summary>
    /// Company or business name
    /// </summary>
    public string? CompanyName { get; set; }
    
    /// <summary>
    /// Australian Business Number
    /// </summary>
    public string? ABN { get; set; }
    
    /// <summary>
    /// Professional license number
    /// </summary>
    public string? LicenseNumber { get; set; }
    
    /// <summary>
    /// Professional type as enum name string: "Advocate", "Broker", "Conveyancer", or "BuildAndPest"
    /// This field is critical for Feature 4.5 - Professional Type Management
    /// </summary>
    public string? ProfessionalType { get; set; }
    
    /// <summary>
    /// List of regions the professional services (e.g., "Melbourne CBD", "Sydney")
    /// </summary>
    public List<string>? Regions { get; set; }
    
    /// <summary>
    /// List of Australian states the professional services
    /// </summary>
    public List<AustralianState>? States { get; set; }
    
    /// <summary>
    /// List of professional specializations (e.g., FirstHomeBuyers, LuxuryHomes)
    /// </summary>
    public List<Specialisation>? Specialisations { get; set; }
}