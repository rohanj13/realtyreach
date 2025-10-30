import { AustralianState } from "@/Models/Job";

export const getStateName = (stateId: number): string => {
  return AustralianState[stateId] ?? "Unknown";
};