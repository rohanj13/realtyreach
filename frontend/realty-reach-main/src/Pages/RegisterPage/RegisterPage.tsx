import React, { useState } from 'react';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  IconButton,
  Alert,
  FormHelperText
} from '@mui/material';
import { PersonAddOutlined as PersonAddIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/useAuth';
import * as yup from 'yup';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password should be at least 8 characters')
    .required('Password is required')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Password must contain at least one letter, one number, and one special character'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  role: yup
    .string()
    .oneOf(['Customer', 'Professional'], 'Please select a role')
    .required('Role is required')
});

const RegisterPage: React.FC = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Customer',
    showPassword: false,
    showConfirmPassword: false
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear specific field error when user changes the field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear API error when user makes changes
    if (apiError) setApiError(null);
  };
  
  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setFormData({ ...formData, showPassword: !formData.showPassword });
    } else {
      setFormData({ ...formData, showConfirmPassword: !formData.showConfirmPassword });
    }
  };
  
  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const validationErrors: { [key: string]: string } = {};
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path] = error.message;
          }
        });
        setErrors(validationErrors);
      }
      return false;
    }
  };
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!(await validateForm())) {
      return;
    }
    
    setLoading(true);
    setApiError(null);
    
    try {
      await registerUser(formData.email, formData.password, formData.role);
      // The navigation will happen in the auth context after successful registration
    } catch (err) {
      setApiError('Registration failed. Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 4
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <PersonAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create Your Account
          </Typography>
          
          {apiError && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {apiError}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={formData.showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => togglePasswordVisibility('password')}
                      edge="end"
                    >
                      {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={formData.showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      edge="end"
                    >
                      {formData.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl 
              component="fieldset" 
              margin="normal" 
              fullWidth 
              error={!!errors.role}
            >
              <FormLabel component="legend">I am a:</FormLabel>
              <RadioGroup
                aria-label="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                row
              >
                <FormControlLabel value="Customer" control={<Radio />} label="Customer" />
                <FormControlLabel value="Professional" control={<Radio />} label="Professional" />
              </RadioGroup>
              {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
            </FormControl>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="text" 
            color="primary" 
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
