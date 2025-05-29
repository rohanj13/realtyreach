using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RealtyReachApi.Models;

public class Suburb
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string Postcode { get; set; }

    [Required]
    public string Locality { get; set; }
    
    [Required]
    public string Region { get; set; }

    [Required]
    public AustralianState State { get; set; }

    public double Longitude { get; set; }
    public double Latitude { get; set; }
}
