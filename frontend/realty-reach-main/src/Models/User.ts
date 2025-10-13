export interface UserProfile {
  Id: string;
  Email: string;
  FirstName: string;
  LastName: string;
  FirstLogin: boolean;
}

export interface CustomerProfile extends UserProfile {
  // Customer specific fields can be added here
}

export interface ProfessionalProfile extends UserProfile {
  ABN: string;
  LicenseNumber: string;
  CompanyName: string;
  ProfessionType?: number;
}

export enum ProfessionalTypeEnum {
  Advocate = 1,
  Broker = 2,
  Conveyancer = 3,
  BuildAndPest = 4
}

export const ProfessionalTypeEnumMapping: Record<ProfessionalTypeEnum, string> = {
  [ProfessionalTypeEnum.Advocate]: "Buyer's Advocate",
  [ProfessionalTypeEnum.Broker]: "Mortgage Broker",
  [ProfessionalTypeEnum.Conveyancer]: "Conveyancer",
  [ProfessionalTypeEnum.BuildAndPest]: "Building & Pest Inspector",
};
