import { Specialisation } from "@/Models/Job";

export const getSpecialisationName = (specId: number): string => {
  return Specialisation[specId] ?? "Unknown";
};