using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedData.Models
{
    public class Request
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RequestId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string PurchaseType { get; set; } // e.g., First Home, Investment Property

        [Required]
        [MaxLength(50)]
        public string JourneyProgress { get; set; } // e.g., Just Started, Have Pre-approval, Post Purchase

        public string AdditionalDetails { get; set; }

        public int? BudgetMin { get; set; }

        public int? BudgetMax { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } // e.g., Open, Closed

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string ContactEmail { get; set; }

        [Required]
        [Phone]
        public string ContactPhone { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public DateTime UpdatedAt { get; set; }
    }
}
