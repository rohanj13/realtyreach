namespace RealtyReachApi.Models;

public class ProfessionalType
{
    public enum ProfessionalTypeEnum
    {
        Advocate = 1,
        Broker = 2,
        BuildAndPest = 3
    }
    // Primary Key, should align with the enum values
    public int Id { get; set; }
    
    // Name of the professional type (e.g., "Advocate")
    public string TypeName { get; set; }
    
    // Optional: Description of the professional type
    public string? Description { get; set; }
}