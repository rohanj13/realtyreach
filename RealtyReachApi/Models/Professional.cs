using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Professional
{
    [Key]
    public int ProfessionalId { get; set; } // Unique ID for professionals

    [Required]
    [ForeignKey("User")]
    public string UserId { get; set; } // Foreign key to User

    [Required]
    public string Abn { get; set; } // Australian Business Number (ABN)

    [Required]
    public string ProfessionName { get; set; }

    [Required]
    public string LicenceNumber { get; set; }

    public string VerificationStatus { get; set; } = "Pending"; // Default status

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property for User
    public User User { get; set; }
}
