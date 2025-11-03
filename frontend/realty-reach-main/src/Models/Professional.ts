import { AustralianState, Specialisation } from './Job';

export interface Professional {
    id: string;
    professionalTypeId: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    abn?: string;
    licenseNumber?: string;
    verificationStatus: boolean;
    companyName?: string;
    regions?: string[];
    states?: AustralianState[];
    specialisations?: Specialisation[];
    firstLogin?: boolean;
}

export interface ProfessionalProfile extends Professional {
    // Additional fields for the profile view
    rating?: number;
    reviewCount?: number;
    completedJobs?: number;
    responseRate?: number;
    averageResponseTime?: number;
}