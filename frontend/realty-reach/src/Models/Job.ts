export interface Job {
    jobId: string;
    JobType: 'Buy' | 'Sell';
    Postcode: string;
    PurchaseType: string;
    PropertyType: string;
    BudgetMin: number;
    BudgetMax: number;
    JourneyProgress: string;
    AdditionalDetails: string;
    ContactEmail: string;
    ContactPhone: string;
}

export interface CreateJobDto {
    JobType: 'Buy' | 'Sell';
    Postcode: string;
    PurchaseType: string;
    PropertyType: string;
    BudgetMin: number;
    BudgetMax: number;
    JourneyProgress: string;
    AdditionalDetails: string;
    ContactEmail: string;
    ContactPhone: string;
}

export interface UpdateJobDto {
    title: string;
    description: string;
    // Add other fields for updating a job
}