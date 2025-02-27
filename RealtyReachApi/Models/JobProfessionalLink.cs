

namespace RealtyReachApi.Models;

public class JobProfessionalLink
{
    public int JobDetailId { get; set; } // Composite Key Part 1
    public Guid ProfessionalId { get; set; } // Composite Key Part 2

    public DateTime SelectionDate { get; set; } // Optional Attribute
    public DateTime AssignedDate { get; set; }

    // Navigation properties
    public JobDetail JobDetail { get; set; }
    public Professional Professional { get; set; }
}