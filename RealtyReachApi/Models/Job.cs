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

        [Required]
        public required string UserId { get; set; }

        [Required]
        [StringLength(10)]
        public required string JobType { get; set; }  // "Buy" or "Sell"

        public required string AdditionalDetails { get; set; }

        [Required]
        public required JobStatus Status { get; set; }  // e.g., Open, Closed

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public required JobDetail JobDetails { get; set; }
    }
}