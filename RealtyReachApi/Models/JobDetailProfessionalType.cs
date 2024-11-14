namespace RealtyReachApi.Models;

public class JobDetailProfessionalType
{
    public int JobDetailId { get; set; }
    public JobDetail JobDetail { get; set; }

    public int ProfessionalTypeId { get; set; }
    public ProfessionalType ProfessionalType { get; set; }
}