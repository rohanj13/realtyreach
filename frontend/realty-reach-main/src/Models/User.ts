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
  Conveyancer = 2,
  BuildAndPest = 3,
  Broker = 4
}

export const ProfessionalTypeEnumMapping = {
  [ProfessionalTypeEnum.Advocate]: "Buyer's Advocate",
  [ProfessionalTypeEnum.Conveyancer]: "Conveyancer",
  [ProfessionalTypeEnum.BuildAndPest]: "Building & Pest Inspector",
  [ProfessionalTypeEnum.Broker]: "Mortgage Broker",
};
