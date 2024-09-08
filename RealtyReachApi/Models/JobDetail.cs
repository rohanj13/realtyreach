using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RealtyReachApi.Models;
public class JobDetail
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int JobDetailId { get; set; }

    [Required]
    public int JobId { get; set; }

    [ForeignKey("JobId")]
    public Job job { get; set; }

    [Required]
    public required string LocationOrPostCode { get; set; }  // Comma Separated Strings

    [Required]
    public required string PurchaseType { get; set; }  // First Home/Investment Property

    [Required]
    public required string PropertyType { get; set; }  // Comma Separated Strings of Property Types

    [Required]
    public required string JourneyProgress { get; set; }  // Just Started, Have Pre-approval, Post Purchase

    [Required]
    public int BudgetMin { get; set; }

    [Required]
    public int BudgetMax { get; set; }

    [Required]
    [EmailAddress]
    public required string ContactEmail { get; set; }

    [Required]
    [Phone]
    public required string ContactPhone { get; set; }
}