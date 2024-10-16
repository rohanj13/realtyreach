public class JobDetailDto
{
    public int JobDetailId { get; set; }
    public int JobId { get; set; }
    public required string Postcode { get; set; }
    public required string PurchaseType { get; set; }
    public required string PropertyType { get; set; }
    public required string JourneyProgress { get; set; }
    public int BudgetMin { get; set; }
    public int BudgetMax { get; set; }
    public required string ContactEmail { get; set; }
    public required string ContactPhone { get; set; }
}

public class CreateJobDetailDto
{
    public required string Postcode { get; set; }
    public required string PurchaseType { get; set; }
    public required string PropertyType { get; set; }
    public required string JourneyProgress { get; set; }
    public int BudgetMin { get; set; }
    public int BudgetMax { get; set; }
    public required string ContactEmail { get; set; }
    public required string ContactPhone { get; set; }
}

public class UpdateJobDetailDto
{
    public required string Postcode { get; set; }
    public required string PurchaseType { get; set; }
    public required string PropertyType { get; set; }
    public required string JourneyProgress { get; set; }
    public int BudgetMin { get; set; }
    public int BudgetMax { get; set; }
    public required string ContactEmail { get; set; }
    public required string ContactPhone { get; set; }
}
