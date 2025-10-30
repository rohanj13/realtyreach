using RealtyReachApi.Models;

namespace RealtyReachApi.Dtos;

public class JobDto
{
    public int JobId { get; set; }
    public Guid UserId { get; set; }
    public required string JobType { get; set; }
    public required string JobTitle { get; set; }
    //public List<int>  SuburbIds { get; set; }
    public List<string>? Regions { get; set; }
    public List<AustralianState>? States { get; set; }
    public List<Specialisation>? Specialisations { get; set; }
    public required string PurchaseType { get; set; }
    public required string PropertyType { get; set; }
    public required string JourneyProgress { get; set; }
    public required string[] SelectedProfessionals { get; set; }
    public required Guid[] SuggestedProfessionalIds { get; set; }
    public required string Status { get; set; }
    public int BudgetMin { get; set; }
    public int BudgetMax { get; set; }
    public required string ContactEmail { get; set; }
    public required string ContactPhone { get; set; }
    public required string AdditionalDetails { get; set; }
    public required DateTime CreatedAt { get; set; }
}

public class JobInfoDto
{
    public int JobId { get; set; }
    public required string JobType { get; set; }
    public required string JobTitle { get; set; }
    //public List<int>  SuburbIds { get; set; }
    public List<string>? Regions { get; set; }
    public List<AustralianState>? States { get; set; }
    public List<Specialisation>? Specialisations { get; set; }
    public required string PurchaseType { get; set; }
    public required string PropertyType { get; set; }
    public required string JourneyProgress { get; set; }
    public required string Status { get; set; }
    public int BudgetMin { get; set; }
    public int BudgetMax { get; set; }
    public required string ContactEmail { get; set; }
    public required string ContactPhone { get; set; }
    public required string AdditionalDetails { get; set; }
    public required DateTime CreatedAt { get; set; }
}


public class CreateJobDto
{
    // public Guid CustomerId { get; set; }
    public required string JobTitle { get; set; }
    public required string JobType { get; set; }
    //public List<int>  SuburbIds { get; set; }
    public List<string>? Regions { get; set; }
    public List<AustralianState>? States { get; set; }
    public List<Specialisation>? Specialisations { get; set; }
    public string? PurchaseType { get; set; }
    public required string PropertyType { get; set; }
    public int BudgetMin { get; set; }
    public int BudgetMax { get; set; }
    public required string ContactEmail { get; set; }
    public required string ContactPhone { get; set; }

    public required string JourneyProgress { get; set; }

    // SelectedProfessionals are professionals that are chosen by the Customer via the frontend. 
    //I.e = They select ["Advocate", "Building and Pest"]
    public required string[] SelectedProfessionals { get; set; }
    //public required Guid[] SuggestedProfessionalIds { get; set; }
    public string? AdditionalDetails { get; set; }
}

public class UpdateJobDto
{
    /// <summary>
    /// Job ID being updated (required for identification)
    /// </summary>
    public required int JobId { get; set; }

    /// <summary>
    /// Job title - optional for partial updates
    /// </summary>
    public string? JobTitle { get; set; }

    /// <summary>
    /// Job type (Buy/Sell) - optional for partial updates
    /// </summary>
    public string? JobType { get; set; }

    /// <summary>
    /// Service regions - optional for partial updates
    /// </summary>
    public List<string>? Regions { get; set; } = null;

    /// <summary>
    /// Service states - optional for partial updates
    /// </summary>
    public List<AustralianState>? States { get; set; } = null;

    /// <summary>
    /// Specialisations - optional for partial updates
    /// </summary>
    public List<Specialisation>? Specialisations { get; set; } = null;

    /// <summary>
    /// Purchase type - optional for partial updates
    /// </summary>
    public string? PurchaseType { get; set; }

    /// <summary>
    /// Property type - optional for partial updates
    /// </summary>
    public string? PropertyType { get; set; }

    /// <summary>
    /// Budget minimum - optional for partial updates
    /// </summary>
    public int? BudgetMin { get; set; }

    /// <summary>
    /// Budget maximum - optional for partial updates
    /// </summary>
    public int? BudgetMax { get; set; }

    /// <summary>
    /// Contact email - optional for partial updates
    /// </summary>
    public string? ContactEmail { get; set; }

    /// <summary>
    /// Contact phone - optional for partial updates
    /// </summary>
    public string? ContactPhone { get; set; }

    /// <summary>
    /// Additional details about the job - optional for partial updates
    /// </summary>
    public string? AdditionalDetails { get; set; }
}

public class MatchingJobDto
{
    public required int JobId { get; set; }
    public required Guid ProfessionalId { get; set; }

}

public class JobMatchesDto
{
    public JobInfoDto? Job { get; set; }
    public List<ProfessionalDto>? SuggestedProfessionals { get; set; }
    public List<ProfessionalDto>? FinalisedProfessionals { get; set; }
}