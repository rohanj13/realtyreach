using RealtyReachApi.Models;

public class JobDetailDto
{
    public int JobDetailId { get; set; }
    public int JobId { get; set; }
    
    public required string PurchaseType { get; set; }
    public required string PropertyType { get; set; }
    public required string JourneyProgress { get; set; }
    public required string[] SelectedProfessionals { get; set; }
    //public required Guid[] SuggestedProfessionalIds { get; set; }
    //public List<int>  SuburbIds { get; set; }
    public List<string> Regions { get; set; }
    public List<AustralianState> States { get; set; }
    public int BudgetMin { get; set; }
    public int BudgetMax { get; set; }
    public required string ContactEmail { get; set; }
    public required string ContactPhone { get; set; }
    public required List<int> JobDetailProfessionalTypeIds { get; set; } = new List<int>();
}