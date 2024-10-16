public class JobDto
{
    public required string JobType { get; set; }
    public required string Postcode { get; set; }
    public required string PurchaseType { get; set; }
    public required string PropertyType { get; set; }
    public required string JourneyProgress { get; set; }
    public required string Status { get; set; }
    public int BudgetMin { get; set; }
    public int BudgetMax { get; set; }
    public required string ContactEmail { get; set; }
    public required string ContactPhone { get; set; }
    public required string AdditionalDetails { get; set; }
}

public class CreateJobDto
{
    public required string JobType { get; set; }
    public required string Postcode { get; set; }
    public required string PurchaseType { get; set; }
    public required string PropertyType { get; set; }
    public required string JourneyProgress { get; set; }
    public int BudgetMin { get; set; }
    public int BudgetMax { get; set; }
    public required string ContactEmail { get; set; }
    public required string ContactPhone { get; set; }
    public required string AdditionalDetails { get; set; }

}

public class UpdateJobDto
{
    public required string JobType { get; set; }
    public required string AdditionalDetails { get; set; }
    public required string Status { get; set; }
    public required UpdateJobDetailDto JobDetail { get; set; }
}
