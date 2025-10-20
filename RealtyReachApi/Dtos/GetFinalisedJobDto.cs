namespace RealtyReachApi.Dtos
{
    public class GetFinalisedJobDto
    {
        public int JobId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string JobType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Region { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Specialisation { get; set; } = string.Empty;
        public string PurchaseType { get; set; } = string.Empty;
        public string PropertyType { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public DateTime AssignedDate { get; set; }
    }
}
