export enum JobStatus {
    Open = "Open",
    Closed = "Closed",
    InProgress = "InProgress"
}

export enum AustralianState {
    NSW = 1,
    VIC,
    QLD,
    SA,
    WA,
    TAS,
    NT,
    ACT
  }

// export enum Specialisation {
//     FirstHomeBuyers = "First Home Buyer Specialist",
//     Investors = "Investment Property Specialist",
//     LuxuryHomes = "Luxury Homes Specialist",
//     ForeignInvestors = "Foreign Investor Specialist",
//     RuralHomes = "Rural Homes Specialist",
//     Downsizers = "Downsizers SPecialist",
//     Retirees = "Retirement Specialists"
// }
export enum Specialisation {
    FirstHomeBuyers = 1,
    Investors,
    LuxuryHomes,
    ForeignInvestors,
    RuralHomes,
    Downsizers,
    Retirees
}

export interface Job {
    jobId: number;
    status: string;
    jobTitle: string;
    jobType: string;
    regions: string[];
    states: number[];
    specialisations: number[];
    purchaseType?: string;
    propertyType: string;
    budgetMin: number;
    budgetMax: number;
    contactEmail: string;
    contactPhone: string;
    journeyProgress: string;
    selectedProfessionals: string[];
    additionalDetails?: string;
}

export interface CreateJobDto {
    jobTitle: string;
    jobType: string;
    regions: string[];
    states: number[];
    specialisations: number[];
    purchaseType?: string;
    propertyType: string;
    budgetMin: number;
    budgetMax: number;
    contactEmail: string;
    contactPhone: string;
    journeyProgress: string;
    selectedProfessionals: string[];
    additionalDetails?: string;
}

export interface MatchingJobDto {
    jobId: number;
    professionalId: string;
}

export interface UpdateJobDto extends Partial<CreateJobDto> {
    jobId: number;
    status?: JobStatus;
}
