import React, { useState, FormEvent, ChangeEvent, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  TextField,
  MenuItem,
  Select,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
  FormHelperText,
  Grid,
  FormGroup,
  Checkbox,
  Divider,
  Alert,
  InputAdornment,
  Snackbar,
  Autocomplete,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';
import { Phone as PhoneIcon, Email as EmailIcon } from '@mui/icons-material';
import { updateJob } from '../services/JobService';
import { AustralianState, Job, UpdateJobDto, Specialisation } from '../Models/Job';
import { ProfessionalTypeEnum, ProfessionalTypeEnumMapping } from '../Models/User';
import { UserContext } from '../Context/userContext';
import { LocationService, Region, State } from '../services/LocationService';
import { PROPERTY_TYPES, PURCHASE_TYPES } from '../Constants/JobConstants';

interface FormData {
  jobType?: "Buy" | "Sell";
  jobTitle?: string;
  regions?: string[];
  states?: number[];
  specialisations?: number[];
  purchaseType?: string;
  propertyType?: string;
  budgetMin?: number;
  budgetMax?: number;
  contactEmail?: string;
  contactPhone?: string;
  additionalDetails?: string;
}

interface EditJobFormProps {
  job: Job;
  onClose: () => void;
  onSuccess: () => void;
}

const EditJobForm: React.FC<EditJobFormProps> = ({ job, onClose, onSuccess }) => {
  const { user } = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regions, setRegions] = useState<string[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [formData, setFormData] = useState<FormData>({
    jobType: job.jobType as "Buy" | "Sell",
    jobTitle: job.jobTitle,
    regions: job.regions || [],
    states: job.states || [],
    specialisations: job.specialisations || [],
    purchaseType: job.purchaseType,
    propertyType: job.propertyType,
    budgetMin: job.budgetMin,
    budgetMax: job.budgetMax,
    contactEmail: job.contactEmail,
    contactPhone: job.contactPhone,
    additionalDetails: job.additionalDetails,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [stateOptions, setStateOptions] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoadingLocations(true);
        const [regionsData, statesData] = await Promise.all([
          LocationService.getAllRegions(),
          LocationService.getAllStates().then((states: string[]) => {
            const options = states.map((stateStr) => ({
              label: stateStr,
              value: AustralianState[stateStr as keyof typeof AustralianState],
            }));
            setStateOptions(options);
          })
        ]);
        setRegions(regionsData);
        setLocationError(null);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setLocationError('Failed to load location data. Please try again later.');
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (formData.jobTitle && formData.jobTitle.trim().length < 5) {
      newErrors.jobTitle = 'Job title must be at least 5 characters';
      isValid = false;
    }

    if (formData.propertyType !== undefined && formData.propertyType.trim() === '') {
      newErrors.propertyType = 'Property type is required';
      isValid = false;
    }

    if (formData.regions && formData.regions.length === 0 && formData.states && formData.states.length === 0) {
      newErrors.regions = 'At least one region or state is required';
      isValid = false;
    }

    if (formData.budgetMin !== undefined && formData.budgetMin <= 0) {
      newErrors.budgetMin = 'Minimum budget must be greater than 0';
      isValid = false;
    }

    if (
      formData.budgetMin !== undefined &&
      formData.budgetMax !== undefined &&
      formData.budgetMax <= formData.budgetMin
    ) {
      newErrors.budgetMax = 'Maximum budget must be greater than minimum budget';
      isValid = false;
    }

    if (formData.contactEmail && !formData.contactEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.contactEmail = 'Please enter a valid email address';
      isValid = false;
    }

    if (formData.contactPhone && formData.contactPhone.length < 8) {
      newErrors.contactPhone = 'Please enter a valid phone number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (errors[name as keyof FormData]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleRegionChange = (event: any, value: string[]) => {
    setFormData((prev) => ({ ...prev, regions: value }));
    if (errors.regions) {
      setErrors((prev) => ({ ...prev, regions: undefined }));
    }
  };

  const handleStateChange = (event: any, value: { label: string; value: number }[]) => {
    const selectedStates = value.map((option) => option.value);
    setFormData((prev) => ({ ...prev, states: selectedStates }));
    if (errors.states) {
      setErrors((prev) => ({ ...prev, states: undefined }));
    }
  };

  const handleSpecialisationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setFormData((prev) => {
      const specialisations = prev.specialisations || [];
      if (event.target.checked) {
        return { ...prev, specialisations: [...specialisations, value] };
      } else {
        return { ...prev, specialisations: specialisations.filter((s) => s !== value) };
      }
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData: UpdateJobDto = {
        jobId: job.jobId,
        ...formData,
      };

      await updateJob(updateData);

      setSnackbar({
        open: true,
        message: 'Job updated successfully!',
        severity: 'success',
      });

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error updating job:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update job. Please try again.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingLocations) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (locationError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {locationError}
      </Alert>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Edit Job Details
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Update any job details you'd like to change. Leave fields blank to keep the current values.
      </Alert>

      {/* Job Basic Information */}
      <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Basic Information
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.jobType}>
          <FormLabel>Job Type</FormLabel>
          <RadioGroup
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            row
          >
            <FormControlLabel value="Buy" control={<Radio />} label="Buy" />
            <FormControlLabel value="Sell" control={<Radio />} label="Sell" />
          </RadioGroup>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.jobTitle}>
          <FormLabel htmlFor="job-title">Job Title</FormLabel>
          <TextField
            id="job-title"
            name="jobTitle"
            placeholder="e.g., Looking for a buyer's advocate for my first home"
            value={formData.jobTitle}
            onChange={handleChange}
            fullWidth
            size="small"
          />
          {errors.jobTitle && <FormHelperText>{errors.jobTitle}</FormHelperText>}
        </FormControl>
      </Box>

      {/* Property Details */}
      <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Property Details
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.propertyType}>
          <FormLabel htmlFor="property-type">Property Type</FormLabel>
          <Select
            id="property-type"
            name="propertyType"
            value={formData.propertyType || ''}
            onChange={handleSelectChange}
            size="small"
            displayEmpty
          >
            <MenuItem value="">Select property type</MenuItem>
            {PROPERTY_TYPES.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {errors.propertyType && <FormHelperText>{errors.propertyType}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.purchaseType}>
          <FormLabel htmlFor="purchase-type">Purchase Type</FormLabel>
          <Select
            id="purchase-type"
            name="purchaseType"
            value={formData.purchaseType || ''}
            onChange={handleSelectChange}
            size="small"
            displayEmpty
          >
            <MenuItem value="">Select purchase type</MenuItem>
            {PURCHASE_TYPES.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.regions}>
          <FormLabel htmlFor="regions">Service Regions</FormLabel>
          <Autocomplete
            multiple
            id="regions"
            options={regions}
            value={formData.regions || []}
            onChange={handleRegionChange}
            size="small"
            renderInput={(params) => <TextField {...params} placeholder="Select regions" />}
          />
          {errors.regions && <FormHelperText>{errors.regions}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.states}>
          <FormLabel htmlFor="states">States</FormLabel>
          <Autocomplete
            multiple
            id="states"
            options={stateOptions}
            value={stateOptions.filter((option) => formData.states?.includes(option.value))}
            onChange={handleStateChange}
            getOptionLabel={(option) => option.label}
            size="small"
            renderInput={(params) => <TextField {...params} placeholder="Select states" />}
          />
          {errors.states && <FormHelperText>{errors.states}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <FormLabel>Specialisations</FormLabel>
          <FormGroup>
            {Object.entries(Specialisation).map(([key, value]) => {
              if (typeof value === 'number') {
                return (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox
                        checked={formData.specialisations?.includes(value) || false}
                        onChange={handleSpecialisationChange}
                        value={value}
                      />
                    }
                    label={key}
                  />
                );
              }
              return null;
            })}
          </FormGroup>
        </FormControl>
      </Box>

      {/* Budget Information */}
      <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Budget
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.budgetMin}>
              <FormLabel htmlFor="budget-min">Minimum Budget ($)</FormLabel>
              <TextField
                id="budget-min"
                name="budgetMin"
                type="number"
                value={formData.budgetMin || 0}
                onChange={handleChange}
                fullWidth
                size="small"
              />
              {errors.budgetMin && <FormHelperText>{errors.budgetMin}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.budgetMax}>
              <FormLabel htmlFor="budget-max">Maximum Budget ($)</FormLabel>
              <TextField
                id="budget-max"
                name="budgetMax"
                type="number"
                value={formData.budgetMax || 0}
                onChange={handleChange}
                fullWidth
                size="small"
              />
              {errors.budgetMax && <FormHelperText>{errors.budgetMax}</FormHelperText>}
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Contact Information */}
      <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Contact Information
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.contactEmail}>
          <FormLabel htmlFor="contact-email">Contact Email</FormLabel>
          <TextField
            id="contact-email"
            name="contactEmail"
            type="email"
            placeholder="Enter your email address"
            value={formData.contactEmail || ''}
            onChange={handleChange}
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          {errors.contactEmail && <FormHelperText>{errors.contactEmail}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.contactPhone}>
          <FormLabel htmlFor="contact-phone">Contact Phone</FormLabel>
          <TextField
            id="contact-phone"
            name="contactPhone"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.contactPhone || ''}
            onChange={handleChange}
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          {errors.contactPhone && <FormHelperText>{errors.contactPhone}</FormHelperText>}
        </FormControl>
      </Box>

      {/* Additional Details */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <FormLabel htmlFor="additional-details">Additional Details</FormLabel>
          <TextField
            id="additional-details"
            name="additionalDetails"
            placeholder="Any additional information about your job..."
            value={formData.additionalDetails || ''}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            size="small"
          />
        </FormControl>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditJobForm;
