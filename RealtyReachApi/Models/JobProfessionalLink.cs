namespace RealtyReachApi.Models;

public class JobProfessionalLink
{
    public int JobId { get; set; } // Required foreign key property
    public Job Job { get; set; } = null!; // Required reference navigation to principal
    public int ProfessionalId { get; set; } // Required foreign key property
    public Professional Professional { get; set; } = null!; // Required reference navigation to principal
    public DateTime AssignedDate { get; set; }
}