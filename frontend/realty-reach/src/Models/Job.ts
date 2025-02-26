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
    title: string;
    description: string;
    // Add other fields for updating a job
}