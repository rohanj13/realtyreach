export type UserProfileToken = {
    token: string;
  };
  
// Base User Profile
export type UserProfile = {
  Id: string;
  Email: string;
  FirstName: string;
  LastName: string;
};

// Customer Profile
export type CustomerProfile = UserProfile & {
};

// Professional Profile (extends UserProfile with additional fields)
export type ProfessionalProfile = UserProfile & {
  ABN: string;
  LicenseNumber: string;
  VerificationStatus: string;
  CompanyName: string;
};
