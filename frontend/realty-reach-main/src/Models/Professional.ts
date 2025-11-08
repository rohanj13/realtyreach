import { AustralianState, Specialisation } from './Job';

/**
 * Base professional data interface
 * Used for basic professional information from /api/Professional endpoint
 */
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
    professionalType?: string;
}

/**
 * Extended professional profile data with professional type details
 * Returned from the /api/Professional/profile endpoint
 */
export interface ProfessionalProfileData extends Professional {
    professionalTypeName: string;
    professionalTypeDescription: string;
    regions: string[];
    states: number[];
    specialisations: number[];
}

/**
 * Professional profile with additional metrics
 * Used for display purposes with calculated fields
 */
export interface ProfessionalProfileWithMetrics extends Professional {
    // Additional fields for the profile view
    rating?: number;
    reviewCount?: number;
    completedJobs?: number;
    responseRate?: number;
    averageResponseTime?: number;
}