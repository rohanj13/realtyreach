import React, { useState, FormEvent, ChangeEvent } from 'react';
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
  Stepper,
  Step,
  StepLabel,
  FormHelperText,
  Grid,
  FormGroup,
  Checkbox,
  Divider,
  Alert,
  InputAdornment,
  Snackbar,
} from '@mui/material';
import { Phone as PhoneIcon, Email as EmailIcon } from '@mui/icons-material';
import { createJob } from '../services/JobService';
import { CreateJobDto } from '../Models/Job';
import { ProfessionalTypeEnum, ProfessionalTypeEnumMapping } from '../Models/User';
import { useAuth } from '../Context/useAuth';

interface FormData {
  jobType: 'Buy' | 'Sell';
  jobTitle: string;
  postcode: string;
  purchaseType: string;
  propertyType: string;
  budgetMin: number;
  budgetMax: number;
  journeyProgress: string;
  selectedProfessionals: ProfessionalTypeEnum[];
  additionalDetails: string;
  contactEmail: string;
  contactPhone: string;
}

type BuyingStages = 'Just Started' | 'Pre-Approval' | 'Post Purchase';

const buyingStages: Record<BuyingStages, ProfessionalTypeEnum[]> = {
  "Just Started": [ProfessionalTypeEnum.Advocate, ProfessionalTypeEnum.Broker],
  "Pre-Approval": [
    ProfessionalTypeEnum.Advocate,
    ProfessionalTypeEnum.Conveyancer,
    ProfessionalTypeEnum.BuildAndPest,
  ],
  "Post Purchase": [
    ProfessionalTypeEnum.Conveyancer,
    ProfessionalTypeEnum.BuildAndPest,
  ],
};

interface JobFormProps {
  onClose: () => void;
}

const CreateJobForm: React.FC<JobFormProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Basic Information', 'Property Details', 'Journey Progress', 'Contact Information'];
  
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
    jobType: 'Buy',
    jobTitle: '',
    postcode: '',
    purchaseType: '',
    propertyType: '',
    budgetMin: 0,
    budgetMax: 0,
    journeyProgress: '',
    selectedProfessionals: [],
    additionalDetails: '',
    contactEmail: user?.Email || '',
    contactPhone: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validateStep = () => {
    let stepValid = true;
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (activeStep === 0) {
      if (!formData.jobType) {
        newErrors.jobType = 'Job type is required';
        stepValid = false;
      }
      if (!formData.jobTitle || formData.jobTitle.trim().length < 5) {
        newErrors.jobTitle = 'Job title must be at least 5 characters';
        stepValid = false;
      }
      if (!formData.postcode || !formData.postcode.match(/^\d{4}$/)) {
        newErrors.postcode = 'Please enter a valid 4-digit postcode';
        stepValid = false;
      }
      if (!formData.purchaseType) {
        newErrors.purchaseType = 'Purchase type is required';
        stepValid = false;
      }
    }

    if (activeStep === 1) {
      if (!formData.propertyType) {
        newErrors.propertyType = 'Property type is required';
        stepValid = false;
      }
      if (formData.budgetMin <= 0) {
        newErrors.budgetMin = 'Minimum budget must be greater than 0';
        stepValid = false;
      }
      if (formData.budgetMax <= formData.budgetMin) {
        newErrors.budgetMax = 'Maximum budget must be greater than minimum budget';
        stepValid = false;
      }
    }

    if (activeStep === 2) {
      if (!formData.journeyProgress) {
        newErrors.journeyProgress = 'Journey progress is required';
        stepValid = false;
      }
      if (formData.selectedProfessionals.length === 0) {
        newErrors.selectedProfessionals = 'Please select at least one professional';
        stepValid = false;
      }
    }

    if (activeStep === 3) {
      if (!formData.contactEmail || !formData.contactEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        newErrors.contactEmail = 'Please enter a valid email address';
        stepValid = false;
      }
      if (!formData.contactPhone || formData.contactPhone.length < 8) {
        newErrors.contactPhone = 'Please enter a valid phone number';
        stepValid = false;
      }
    }

    setErrors(newErrors);
    return stepValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear the error for this field if it exists
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleNumberChange = (field: 'budgetMin' | 'budgetMax', value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setFormData((prev) => ({ ...prev, [field]: numValue }));
    
    // Clear the error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };
  
  const handleSelectChange = (e: ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({ ...prev, [name]: value }));
      
      // Handle journey progress selection automatically updating professionals
      if (name === 'journeyProgress') {
        const stage = value as BuyingStages;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          selectedProfessionals: buyingStages[stage] || []
        }));
      }
      
      // Clear the error for this field if it exists
      if (errors[name as keyof FormData]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as 'Buy' | 'Sell';
    setFormData((prev) => ({ ...prev, jobType: value }));
    
    // Clear the error for this field if it exists
    if (errors.jobType) {
      setErrors((prev) => ({ ...prev, jobType: undefined }));
    }
  };

  const handleProfessionalCheck = (professionalType: ProfessionalTypeEnum) => {
    setFormData((prev) => {
      const currentSelected = [...prev.selectedProfessionals];
      const index = currentSelected.indexOf(professionalType);
      
      if (index === -1) {
        currentSelected.push(professionalType);
      } else {
        currentSelected.splice(index, 1);
      }
      
      return { ...prev, selectedProfessionals: currentSelected };
    });
    
    // Clear the error for this field if it exists
    if (errors.selectedProfessionals) {
      setErrors((prev) => ({ ...prev, selectedProfessionals: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStep()) {
      return;
    }

    const createJobDto: CreateJobDto = {
      JobType: formData.jobType,
      JobTitle: formData.jobTitle,
      Postcode: formData.postcode,
      PurchaseType: formData.purchaseType,
      PropertyType: formData.propertyType,
      BudgetMin: formData.budgetMin,
      BudgetMax: formData.budgetMax,
      JourneyProgress: formData.journeyProgress,
      SelectedProfessionals: formData.selectedProfessionals,
      AdditionalDetails: formData.additionalDetails || '',
      ContactEmail: formData.contactEmail,
      ContactPhone: formData.contactPhone,
    };

    try {
      await createJob(createJobDto);
      setSnackbar({
        open: true,
        message: 'Job created successfully!',
        severity: 'success',
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error creating job',
        severity: 'error',
      });
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.jobType}>
              <FormLabel id="job-type-label">Job Type</FormLabel>
              <RadioGroup
                row
                aria-labelledby="job-type-label"
                name="jobType"
                value={formData.jobType}
                onChange={handleRadioChange}
              >
                <FormControlLabel value="Buy" control={<Radio />} label="Buy" />
                <FormControlLabel value="Sell" control={<Radio />} label="Sell" disabled />
              </RadioGroup>
              {errors.jobType && <FormHelperText>{errors.jobType}</FormHelperText>}
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.jobTitle}>
              <FormLabel htmlFor="job-title">Job Title</FormLabel>
              <TextField
                id="job-title"
                name="jobTitle"
                placeholder="E.g., Buying a house in Melbourne"
                value={formData.jobTitle}
                onChange={handleChange}
                fullWidth
                size="small"
              />
              {errors.jobTitle && <FormHelperText>{errors.jobTitle}</FormHelperText>}
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.postcode}>
              <FormLabel htmlFor="postcode">Job Location (Postcode)</FormLabel>
              <TextField
                id="postcode"
                name="postcode"
                placeholder="Enter postcode"
                value={formData.postcode}
                onChange={handleChange}
                fullWidth
                size="small"
              />
              {errors.postcode && <FormHelperText>{errors.postcode}</FormHelperText>}
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.purchaseType}>
              <FormLabel htmlFor="purchase-type">Purchase Type</FormLabel>
              <Select
                id="purchase-type"
                name="purchaseType"
                value={formData.purchaseType}
                onChange={handleSelectChange}
                displayEmpty
                size="small"
              >
                <MenuItem value="" disabled>Select purchase type</MenuItem>
                <MenuItem value="firstHome">First Home</MenuItem>
                <MenuItem value="investment">Investment Property</MenuItem>
                <MenuItem value="upgrade">Upgrade/Downsize</MenuItem>
              </Select>
              {errors.purchaseType && <FormHelperText>{errors.purchaseType}</FormHelperText>}
            </FormControl>
          </Box>
        );
        
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.propertyType}>
              <FormLabel htmlFor="property-type">Property Type</FormLabel>
              <Select
                id="property-type"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleSelectChange}
                displayEmpty
                size="small"
              >
                <MenuItem value="" disabled>Select property type</MenuItem>
                <MenuItem value="house">House</MenuItem>
                <MenuItem value="apartment">Apartment</MenuItem>
                <MenuItem value="townhouse">Townhouse</MenuItem>
                <MenuItem value="land">Land</MenuItem>
                <MenuItem value="blockOfUnits">Block of Units</MenuItem>
              </Select>
              {errors.propertyType && <FormHelperText>{errors.propertyType}</FormHelperText>}
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Budget Range</FormLabel>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth error={!!errors.budgetMin}>
                    <TextField
                      label="Minimum ($)"
                      type="number"
                      value={formData.budgetMin || ""}
                      onChange={(e) => handleNumberChange('budgetMin', e.target.value)}
                      size="small"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                    {errors.budgetMin && <FormHelperText>{errors.budgetMin}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth error={!!errors.budgetMax}>
                    <TextField
                      label="Maximum ($)"
                      type="number"
                      value={formData.budgetMax || ""}
                      onChange={(e) => handleNumberChange('budgetMax', e.target.value)}
                      size="small"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                    {errors.budgetMax && <FormHelperText>{errors.budgetMax}</FormHelperText>}
                  </FormControl>
                </Grid>
              </Grid>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel htmlFor="additional-details">Additional Details (Optional)</FormLabel>
              <TextField
                id="additional-details"
                name="additionalDetails"
                placeholder="Enter any additional details about the property or your requirements"
                value={formData.additionalDetails}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
              />
            </FormControl>
          </Box>
        );
        
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.journeyProgress}>
              <FormLabel htmlFor="journey-progress">Where are you in your home buying journey?</FormLabel>
              <Select
                id="journey-progress"
                name="journeyProgress"
                value={formData.journeyProgress}
                onChange={handleSelectChange}
                displayEmpty
                size="small"
              >
                <MenuItem value="" disabled>Select journey progress</MenuItem>
                <MenuItem value="Just Started">Just Started</MenuItem>
                <MenuItem value="Pre-Approval">Have Pre-approval</MenuItem>
                <MenuItem value="Post Purchase">Post Purchase</MenuItem>
              </Select>
              {errors.journeyProgress && <FormHelperText>{errors.journeyProgress}</FormHelperText>}
            </FormControl>
            
            {formData.journeyProgress && (
              <FormControl 
                component="fieldset" 
                fullWidth 
                sx={{ mb: 2 }} 
                error={!!errors.selectedProfessionals}
              >
                <FormLabel component="legend">Professionals to notify:</FormLabel>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Based on your progress, we recommend the following professionals:
                </Alert>
                <FormGroup>
                  {buyingStages[formData.journeyProgress as BuyingStages].map((professionalType) => (
                    <FormControlLabel
                      key={professionalType}
                      control={
                        <Checkbox
                          checked={formData.selectedProfessionals.includes(professionalType)}
                          onChange={() => handleProfessionalCheck(professionalType)}
                        />
                      }
                      label={ProfessionalTypeEnumMapping[professionalType]}
                    />
                  ))}
                </FormGroup>
                {errors.selectedProfessionals && (
                  <FormHelperText>{errors.selectedProfessionals}</FormHelperText>
                )}
              </FormControl>
            )}
          </Box>
        );
        
      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.contactEmail}>
              <FormLabel htmlFor="contact-email">Contact Email</FormLabel>
              <TextField
                id="contact-email"
                name="contactEmail"
                type="email"
                placeholder="Enter your email address"
                value={formData.contactEmail}
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
                value={formData.contactPhone}
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
            
            <Box sx={{ mt: 3, mb: 1 }}>
              <Alert severity="info">
                By submitting this form, you're allowing professionals to contact you about your property needs.
              </Alert>
            </Box>
          </Box>
        );
        
      default:
        return null;
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {renderStepContent(activeStep)}
      
      <Divider sx={{ my: 3 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
        >
          Back
        </Button>
        <Box>
          {activeStep === steps.length - 1 ? (
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
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

export default CreateJobForm;
