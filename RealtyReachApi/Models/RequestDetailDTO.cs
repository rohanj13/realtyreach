public class RequestDetailDto
{
    public int RequestDetailId { get; set; }
    public int RequestId { get; set; }
    public string LocationOrPostCode { get; set; }
    public string PurchaseType { get; set; }
    public string PropertyType { get; set; }
    public string JourneyProgress { get; set; }
    public int BudgetMin { get; set; }
    public int BudgetMax { get; set; }
    public string ContactEmail { get; set; }
    public string ContactPhone { get; set; }
}

public class CreateRequestDetailDto
{
    public string LocationOrPostCode { get; set; }
    public string PurchaseType { get; set; }
    public string PropertyType { get; set; }
    public string JourneyProgress { get; set; }
    public int BudgetMin { get; set; }
    public int BudgetMax { get; set; }
    public string ContactEmail { get; set; }
    public string ContactPhone { get; set; }
}

public class UpdateRequestDetailDto
{
    public string LocationOrPostCode { get; set; }
    public string PurchaseType { get; set; }
    public string PropertyType { get; set; }
    public string JourneyProgress { get; set; }
    public int BudgetMin { get; set; }
    public int BudgetMax { get; set; }
    public string ContactEmail { get; set; }
    public string ContactPhone { get; set; }
}
