using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TypeGen.Core.TypeAnnotations;

namespace RealtyReachApi.Models
{
    [ExportTsClass]
    public class Job
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int JobId { get; set; }
        public Guid CustomerId { get; set; } // Required foreign key property
        public Customer Customer { get; set; } = null!; // Required reference navigation to principal
        public required JobDetail? JobDetails { get; set; } // Navigation property
        public required string JobTitle { get; set; }
        [Required] [StringLength(10)] public required string JobType { get; set; } // "Buy" or "Sell"
        public required string AdditionalDetails { get; set; }
        [Required] public required JobStatus Status { get; set; } // e.g., Open, Closed
        [Required] public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
