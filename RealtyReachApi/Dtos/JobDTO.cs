public class JobDto
{
    public int JobId { get; set; }
    public int UserId { get; set; }
    public required string JobType { get; set; }
    public required string AdditionalDetails { get; set; }
    public required string Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public required JobDetailDto JobDetail { get; set; }
}

public class CreateJobDto
{
    public int UserId { get; set; }
    public required string JobType { get; set; }
    public required string AdditionalDetails { get; set; }
    public required string Status { get; set; }
    public required CreateJobDetailDto JobDetail { get; set; }
}

public class UpdateJobDto
{
    public required string JobType { get; set; }
    public required string AdditionalDetails { get; set; }
    public required string Status { get; set; }
    public required UpdateJobDetailDto JobDetail { get; set; }
}
