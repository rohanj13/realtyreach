using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RealtyReachApi.Models;
public class RequestDetail
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int RequestDetailId { get; set; }

    [Required]
    public int RequestId { get; set; }

    [Required]
    [ForeignKey("RequestId")]
    public Request Request { get; set; }

    [Required]
    public string LocationOrPostCode { get; set; }  // Comma Separated Strings

    [Required]
    public string PurchaseType { get; set; }  // First Home/Investment Property

    [Required]
    public string PropertyType { get; set; }  // Comma Separated Strings of Property Types

    [Required]
    public string JourneyProgress { get; set; }  // Just Started, Have Pre-approval, Post Purchase

    [Required]
    public int BudgetMin { get; set; }

    [Required]
    public int BudgetMax { get; set; }

    [Required]
    [EmailAddress]
    public string ContactEmail { get; set; }

    [Required]
    [Phone]
    public string ContactPhone { get; set; }
}