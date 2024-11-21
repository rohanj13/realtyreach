namespace RealtyReachApi.Models;

public class ProfessionalType
{
    public enum ProfessionalTypeEnum
    {
        Advocate = 1,
        Broker = 2,
        BuildAndPest = 3
    }
    public int ProfessionalTypeId { get; set; } // Primary Key
    public string TypeName { get; set; }
    
    public string Description { get; set; }

    // Navigation properties
    public ICollection<JobDetail> JobDetails { get; set; } = new List<JobDetail>();
    public ICollection<Professional> Professionals { get; set; } = new List<Professional>();
}