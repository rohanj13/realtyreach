using RealtyReachApi.Models;

public class JobDetailDto
{
    public int JobDetailId { get; set; }
    public int JobId { get; set; }
    public required string LocationOrPostCode { get; set; }
    public required string PurchaseType { get; set; }
    public required string PropertyType { get; set; }
    public required string JourneyProgress { get; set; }
    public int BudgetMin { get; set; }
    public int BudgetMax { get; set; }
    public required string ContactEmail { get; set; }
    public required string ContactPhone { get; set; }
    public required List<int> JobDetailProfessionalTypeIds { get; set; } = new List<int>();
}

public class CreateJobDetailDto
{
    public required string LocationOrPostCode { get; set; }
    public required string PurchaseType { get; set; }
    public required string PropertyType { get; set; }
    public required string JourneyProgress { get; set; }
    public int BudgetMin { get; set; }
    public int BudgetMax { get; set; }
    public required string ContactEmail { get; set; }
    public required string ContactPhone { get; set; }
    public required List<int> JobDetailProfessionalTypeIds { get; set; }
}

public class UpdateJobDetailDto
{
    public required string LocationOrPostCode { get; set; }
    public required string PurchaseType { get; set; }
    public required string PropertyType { get; set; }
    public required string JourneyProgress { get; set; }
    public int BudgetMin { get; set; }
    public int BudgetMax { get; set; }
    public required string ContactEmail { get; set; }
    public required string ContactPhone { get; set; }
    public required List<int> JobDetailProfessionalTypeIds;
}