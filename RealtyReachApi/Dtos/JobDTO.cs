using RealtyReachApi.Models;

namespace RealtyReachApi.Dtos;

public class JobDto
{
    public int JobId { get; set; }
    public Guid UserId { get; set; }
    public required string JobType { get; set; }
    public required string JobTitle { get; set; }
    //public List<int>  SuburbIds { get; set; }
    public List<string> Regions { get; set; }
    public List<AustralianState> States { get; set; }
    public List<Specialisation> Specialisations { get; set; }
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

public class CreateJobDto
{
    // public Guid CustomerId { get; set; }
    public required string JobTitle { get; set; }
    public required string JobType { get; set; }
    //public List<int>  SuburbIds { get; set; }
    public List<string> Regions { get; set; }
    public List<AustralianState> States { get; set; }
    public List<Specialisation> Specialisations { get; set; }
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

public class MatchingJobDto
{
    public required int JobId { get; set; }
    public required Guid ProfessionalId { get; set; }

}