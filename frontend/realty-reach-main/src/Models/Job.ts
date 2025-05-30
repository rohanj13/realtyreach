export interface Job {
    jobId: string;
    JobTitle: string;
    JobType: 'Buy' | 'Sell';
    Postcode: string;
    PurchaseType: string;
    PropertyType: string;
    BudgetMin: number;
    BudgetMax: number;
    JourneyProgress: string;
    SelectedProfessionals: string[];
    AdditionalDetails: string;
    ContactEmail: string;
    ContactPhone: string;
    Status?: string;
    CreatedAt?: string;
    UpdatedAt?: string;
}

export interface CreateJobDto {
    JobType: 'Buy' | 'Sell';
    JobTitle: string;
    Postcode: string;
    PurchaseType: string;
    PropertyType: string;
    BudgetMin: number;
    BudgetMax: number;
    JourneyProgress: string;
    SelectedProfessionals: number[];
    AdditionalDetails: string;
    ContactEmail: string;
    ContactPhone: string;
}

export interface UpdateJobDto {
    JobId: string;
    JobTitle: string;
    AdditionalDetails: string;
    Status?: string;
}
