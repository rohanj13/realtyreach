using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TypeGen.Core.TypeAnnotations;

namespace RealtyReachApi.Models;

[ExportTsClass]
public class JobDetail
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int JobDetailId { get; set; }
    public int JobId { get; set; } // Required foreign key property
    public Job Job { get; set; } = null!; // Required reference navigation to principal
    public ICollection<JobProfessionalLink> JobProfessionalLinks { get; set; } = new List<JobProfessionalLink>();
    public ICollection<ProfessionalType> ProfessionalTypes { get; set; } = new List<ProfessionalType>();
    //public List<int>  SuburbIds { get; set; } = new List<int>();
    public List<string>? Regions { get; set; }
    public List<AustralianState>? States { get; set; }
    public List<Specialisation>? Specialisations { get; set; } = new List<Specialisation>();

    [Required] public required string PurchaseType { get; set; } // First Home/Investment Property

    [Required] public required string PropertyType { get; set; } // Comma Separated Strings of Property Types

    [Required] public required string JourneyProgress { get; set; } // Just Started, Have Pre-approval, Post Purchase

    public required string[] SelectedProfessionals { get; set; }

    public Guid[] SuggestedProfessionalIds { get; set; }

    [Required] public int BudgetMin { get; set; }

    [Required] public int BudgetMax { get; set; }

    [Required][EmailAddress] public required string ContactEmail { get; set; }

    [Required][Phone] public required string ContactPhone { get; set; }
}