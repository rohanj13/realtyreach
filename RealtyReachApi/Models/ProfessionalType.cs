namespace RealtyReachApi.Models;

public class ProfessionalType
{
    public int Id { get; set; }
    public string TypeName { get; set; }
    public List<JobDetailProfessionalType> JobDetailProfessionalTypes { get; set; } = new List<JobDetailProfessionalType>();
    public List<Professional> Professionals { get; set; } = new List<Professional>();  // One-to-many relationship with Professional
}