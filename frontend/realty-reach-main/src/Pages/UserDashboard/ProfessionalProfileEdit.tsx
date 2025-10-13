import React, { useState, useEffect, useContext } from "react";
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button,
  Grid,
  MenuItem,
  FormControl,
  useTheme,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { UserContext } from "../../Context/userContext";
import { ProfessionalProfile, ProfessionalTypeEnum, ProfessionalTypeEnumMapping } from "../../Models/User";
import { backendApi } from "../../api/backendApi";
import { useNavigate } from "react-router-dom";

interface ProfessionalData {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  abn: string;
  licenseNumber: string;
  professionalTypeId: number;
  professionalType: string;
  verificationStatus: boolean;
  firstLogin: boolean;
}

const ProfessionalProfileEdit: React.FC = () => {
  const { user, setUser } = useContext(UserContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const professionalUser = user as ProfessionalProfile;
  
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    abn: "",
    licenseNumber: "",
    professionalType: ""
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Fetch current profile data on mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await backendApi.get<ProfessionalData>('/api/Professional');
        const data = response.data;
        
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          companyName: data.companyName || "",
          abn: data.abn || "",
          licenseNumber: data.licenseNumber || "",
          professionalType: data.professionalTypeId?.toString() || ""
        });
        
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error fetching profile data:', error);
        setSubmitError("Failed to load profile data. Please try again.");
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, []);
  
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
    
    // Clear submit messages
    if (submitError) setSubmitError("");
    if (submitSuccess) setSubmitSuccess(false);
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.abn.trim()) newErrors.abn = "ABN is required";
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "License number is required";
    if (!formData.professionalType) newErrors.professionalType = "Professional type is required";
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);
    
    try {
      // Convert enum value to enum name string for backend
      const typeEnumKey = Object.keys(ProfessionalTypeEnum).find(
        key => ProfessionalTypeEnum[key as keyof typeof ProfessionalTypeEnum] === Number(formData.professionalType)
      );
      
      if (!typeEnumKey) {
        setSubmitError("Please select a valid professional type.");
        setIsSubmitting(false);
        return;
      }
      
      // Prepare data for backend
      const professionalData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        companyName: formData.companyName,
        abn: formData.abn,
        licenseNumber: formData.licenseNumber,
        professionalType: typeEnumKey, // Send enum name as string
      };
      
      // Use PUT /api/Professional endpoint
      const response = await backendApi.put('/api/Professional', professionalData);
      
      console.log('Profile updated successfully:', response.data);
      
      // Update user context with new data
      if (user) {
        setUser({
          ...user,
          FirstName: formData.firstName,
          LastName: formData.lastName,
          CompanyName: formData.companyName,
          ABN: formData.abn,
          LicenseNumber: formData.licenseNumber,
          ProfessionType: Number(formData.professionalType)
        } as ProfessionalProfile);
      }
      
      setSubmitSuccess(true);
      
      // Navigate back to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/professionaldashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Error updating professional profile:', error);
      
      // Display specific error messages from backend
      if (error.response?.data?.error) {
        setSubmitError(error.response.data.error);
      } else if (error.response?.status === 400) {
        setSubmitError("Invalid professional type. Please select a valid option.");
      } else if (error.response?.status === 404) {
        setSubmitError("Professional profile not found. Please try logging in again.");
      } else {
        setSubmitError("Failed to update your profile. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/professionaldashboard')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            Edit Professional Profile
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Form Content */}
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
            Update Your Professional Profile
          </Typography>
          
          {submitSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Profile updated successfully! Redirecting to dashboard...
            </Alert>
          )}
          
          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {submitError}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
                  Personal Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
                  variant="outlined"
                />
              </Grid>
              
              {/* Business Details */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
                  Business Details
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  error={!!formErrors.companyName}
                  helperText={formErrors.companyName}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="ABN"
                  name="abn"
                  value={formData.abn}
                  onChange={handleInputChange}
                  error={!!formErrors.abn}
                  helperText={formErrors.abn}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="License Number"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  error={!!formErrors.licenseNumber}
                  helperText={formErrors.licenseNumber}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth error={!!formErrors.professionalType}>
                  <TextField
                    select
                    required
                    label="Professional Type"
                    name="professionalType"
                    value={formData.professionalType}
                    onChange={handleInputChange}
                    error={!!formErrors.professionalType}
                    helperText={formErrors.professionalType || "Select your primary professional role"}
                    variant="outlined"
                  >
                    {Object.entries(ProfessionalTypeEnumMapping).map(([key, value]) => (
                      <MenuItem key={key} value={key}>
                        {value}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Grid>
              
              {/* Action Buttons */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/professionaldashboard')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{ minWidth: 120 }}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : 'Save Changes'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfessionalProfileEdit;
