export type UserProfileToken = {
    token: string;
  };
  
// Base User Profile
export type UserProfile = {
  Id: string;
  Email: string;
  FirstName: string;
  LastName: string;
  FirstLogin: boolean;
};

// Customer Profile
export type CustomerProfile = UserProfile & {
};

// Professional Profile (extends UserProfile with additional fields)
export type ProfessionalProfile = UserProfile & {
  ProfessionalTypeId: number;
  ABN: string;
  LicenseNumber: string;
  CompanyName: string;
};

// export interface ProfessionalType {
//   ProfessionalTypeId: number;
//   TypeName: string;
//   Description: string;
// }

export enum ProfessionalTypeEnum {
  Advocate = 1,
  Broker,
  Conveyancer,
  BuildAndPest,
};

export const ProfessionalTypeEnumMapping: Record<string, ProfessionalTypeEnum> = {
  "Buyer's Advocate": ProfessionalTypeEnum.Advocate,
  "Mortgage Broker": ProfessionalTypeEnum.Broker,
  "Conveyancer": ProfessionalTypeEnum.Conveyancer,
  "Building & Pest Inspector": ProfessionalTypeEnum.BuildAndPest,
};