import React, { useState, useContext } from "react";
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  MenuItem,
  FormControl,
  FormHelperText,
  useTheme,
  Alert
} from "@mui/material";
import { UserContext } from "../../Context/userContext";
import { ProfessionalProfile, ProfessionalTypeEnum, ProfessionalTypeEnumMapping } from "../../Models/User";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfProfileCompletion: React.FC = () => {
  const { user } = useContext(UserContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const professionalUser = user as ProfessionalProfile;
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: professionalUser?.FirstName || "",
    lastName: professionalUser?.LastName || "",
    companyName: professionalUser?.CompanyName || "",
    abn: professionalUser?.ABN || "",
    licenseNumber: professionalUser?.LicenseNumber || "",
    professionalType: professionalUser?.ProfessionType || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    suburb: "",
    state: "",
    postcode: "",
    bio: "",
    experience: ""
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const steps = ['Personal Info', 'Business Details', 'Professional Profile'];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 0) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    }
    
    else if (step === 1) {
      if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
      if (!formData.abn.trim()) newErrors.abn = "ABN is required";
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "License number is required";
      if (!formData.professionalType) newErrors.professionalType = "Professional type is required";
    }
    
    else if (step === 2) {
      if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
      if (!formData.suburb.trim()) newErrors.suburb = "Suburb is required";
      if (!formData.state.trim()) newErrors.state = "State is required";
      if (!formData.postcode.trim()) newErrors.postcode = "Postcode is required";
      if (!formData.bio.trim()) newErrors.bio = "Professional bio is required";
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };
  
  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;
    
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      const professionalData = {
        userId: professionalUser?.Id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        companyName: formData.companyName,
        abn: formData.abn,
        licenseNumber: formData.licenseNumber,
        professionalType: Number(formData.professionalType),
        phone: formData.phone,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        suburb: formData.suburb,
        state: formData.state,
        postcode: formData.postcode,
        bio: formData.bio,
        experience: formData.experience
      };
      
      await axios.post('/api/Professional/profile', professionalData);
      
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/professionaldashboard');
      }, 2000);
    } catch (error) {
      console.error('Error submitting professional profile:', error);
      setSubmitError("Failed to complete your profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                required
                variant="outlined"
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                error={!!formErrors.companyName}
                helperText={formErrors.companyName}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ABN"
                name="abn"
                value={formData.abn}
                onChange={handleInputChange}
                error={!!formErrors.abn}
                helperText={formErrors.abn}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="License Number"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                error={!!formErrors.licenseNumber}
                helperText={formErrors.licenseNumber}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.professionalType}>
                <TextField
                  select
                  label="Professional Type"
                  name="professionalType"
                  value={formData.professionalType}
                  onChange={handleInputChange}
                  error={!!formErrors.professionalType}
                  required
                  variant="outlined"
                >
                  {Object.entries(ProfessionalTypeEnumMapping).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>
                {formErrors.professionalType && (
                  <FormHelperText>{formErrors.professionalType}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                error={!!formErrors.addressLine1}
                helperText={formErrors.addressLine1}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 2"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Suburb"
                name="suburb"
                value={formData.suburb}
                onChange={handleInputChange}
                error={!!formErrors.suburb}
                helperText={formErrors.suburb}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                error={!!formErrors.state}
                helperText={formErrors.state}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Postcode"
                name="postcode"
                value={formData.postcode}
                onChange={handleInputChange}
                error={!!formErrors.postcode}
                helperText={formErrors.postcode}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Professional Bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                error={!!formErrors.bio}
                helperText={formErrors.bio}
                required
                variant="outlined"
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Experience (years)"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Complete Your Professional Profile
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Please provide your professional details to start receiving job opportunities
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {submitSuccess ? (
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Profile completed successfully! Redirecting to your dashboard...
              </Alert>
            </Box>
          ) : (
            <>
              <Box sx={{ mb: 4 }}>
                {renderStepContent(activeStep)}
              </Box>
              
              {submitError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {submitError}
                </Alert>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Complete Profile"}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                    >
                      Next Step
                    </Button>
                  )}
                </Box>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfProfileCompletion;
