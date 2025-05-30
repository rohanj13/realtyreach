import React, { useState } from "react";
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button,
  Grid,
  Alert,
  useTheme
} from "@mui/material";
import { useAuth } from "../../Context/useAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomerProfileCompletion: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: user?.FirstName || "",
    lastName: user?.LastName || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    suburb: "",
    state: "",
    postcode: ""
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
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
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
    if (!formData.suburb.trim()) newErrors.suburb = "Suburb is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.postcode.trim()) newErrors.postcode = "Postcode is required";
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      const customerData = {
        userId: user?.Id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        suburb: formData.suburb,
        state: formData.state,
        postcode: formData.postcode
      };
      
      await axios.post('/api/Customer/profile', customerData);
      
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/customerdashboard');
      }, 2000);
    } catch (error) {
      console.error('Error submitting customer profile:', error);
      setSubmitError("Failed to complete your profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Complete Your Profile
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Please provide your details to complete your account setup
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {submitSuccess ? (
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Profile completed successfully! Redirecting to your dashboard...
              </Alert>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
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
              </Grid>
              
              {submitError && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                  {submitError}
                </Alert>
              )}
              
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Complete Profile"}
                </Button>
              </Box>
            </form>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default CustomerProfileCompletion;
