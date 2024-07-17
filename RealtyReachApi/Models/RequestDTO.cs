public class RequestDto
{
    public int RequestId { get; set; }
    public int UserId { get; set; }
    public string RequestType { get; set; }
    public string AdditionalDetails { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public RequestDetailDto RequestDetail { get; set; }
}

public class CreateRequestDto
{
    public int UserId { get; set; }
    public string RequestType { get; set; }
    public string AdditionalDetails { get; set; }
    public string Status { get; set; }
    public CreateRequestDetailDto RequestDetail { get; set; }
}

public class UpdateRequestDto
{
    public string RequestType { get; set; }
    public string AdditionalDetails { get; set; }
    public string Status { get; set; }
    public UpdateRequestDetailDto RequestDetail { get; set; }
}
