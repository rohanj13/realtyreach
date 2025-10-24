/**
 * Job Options Constants
 * Centralized definitions for job-related dropdown options
 * Changes here will cascade to all components using these constants
 */

export interface OptionValue {
  value: string;
  label: string;
}

/**
 * Property Type Constants
 */

export interface PropertyTypeOption extends OptionValue {}

export const PROPERTY_TYPES: PropertyTypeOption[] = [
  { value: 'House', label: 'House' },
  { value: 'Apartment', label: 'Apartment' },
  { value: 'Townhouse', label: 'Townhouse' },
  { value: 'Land', label: 'Land' },
  { value: 'BlockOfUnits', label: 'Block of Units' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Other', label: 'Other' },
];

/**
 * Get property type label by value
 * @param value - The property type value
 * @returns The label or the value if not found
 */
export const getPropertyTypeLabel = (value: string): string => {
  const option = PROPERTY_TYPES.find(pt => pt.value === value);
  return option?.label || value;
};

/**
 * Purchase Type Constants
 */

export interface PurchaseTypeOption extends OptionValue {}

export const PURCHASE_TYPES: PurchaseTypeOption[] = [
  { value: 'First Home', label: 'First Home' },
  { value: 'Investment', label: 'Investment' },
  { value: 'Downsizing', label: 'Downsizing' },
  { value: 'Other', label: 'Other' },
];

/**
 * Get purchase type label by value
 * @param value - The purchase type value
 * @returns The label or the value if not found
 */
export const getPurchaseTypeLabel = (value: string): string => {
  const option = PURCHASE_TYPES.find(pt => pt.value === value);
  return option?.label || value;
};
