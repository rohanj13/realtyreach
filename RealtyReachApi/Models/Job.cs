using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RealtyReachApi.Models
{
    public class Job
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int JobId { get; set; }

        // Foreign Key to Customer
        public Guid CustomerId { get; set; } // Required foreign key property
        public Customer Customer { get; set; } = null!; // Required reference navigation to principal

        // Foreign Key to JobDetails
        public JobDetail JobDetails { get; set; } = null!; // Reference navigation to dependent

        // Foreign Key to JobProfessionalLink 
        public ICollection<JobProfessionalLink> JobProfessionalLinks { get; } =
            new List<JobProfessionalLink>(); // Collection navigation containing dependents

        [Required] [StringLength(10)] public required string JobType { get; set; } // "Buy" or "Sell"

        public required string AdditionalDetails { get; set; }

        [Required] [StringLength(10)] public required string Status { get; set; } // e.g., Open, Closed

        [Required] public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Validate if a job has been matched to a maximum number of professionals
        public Boolean IsMatched { get; set; }
    }
}