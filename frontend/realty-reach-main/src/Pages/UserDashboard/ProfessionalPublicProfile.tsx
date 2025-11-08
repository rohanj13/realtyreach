import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Paper,
  Grid,
  Chip,
  Divider,
  Avatar,
  Button,
  Card,
  CardContent,
  useTheme,
  CircularProgress,
  Alert
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Verified as VerifiedIcon,
  Business as BusinessIcon,
  LocationOn as LocationOnIcon,
  Star as StarIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { backendApi } from "../../api/backendApi";
import { ProfessionalProfileData } from "../../Models/Professional";
import { getStateName } from "../../helpers/getStateName";
import { getSpecialisationName } from "../../helpers/getSpecialisationName";

const ProfessionalPublicProfile: React.FC = () => {
  const { professionalId } = useParams<{ professionalId: string }>();
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState<ProfessionalProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!professionalId) {
        setError("Professional ID is required.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await backendApi.get<ProfessionalProfileData>(`/api/Professional/${professionalId}`);
        setProfileData(response.data);
      } catch (err: any) {
        console.error("Error fetching professional profile:", err);
        setError(err.response?.data?.Error || "Failed to load professional profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [professionalId]);

  const handleBack = () => {
    // Navigate back to previous page
    navigate(-1);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !profileData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error || "Profile data not available."}</Alert>
        <Button 
          variant="contained" 
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* App Bar */}
      <AppBar 
        position="static" 
        color="default" 
        elevation={0}
        sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Professional Profile
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Profile Header Card */}
        <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  bgcolor: theme.palette.primary.main,
                  fontSize: '3rem'
                }}
              >
                {profileData.firstName?.charAt(0)}{profileData.lastName?.charAt(0)}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h4">
                  {profileData.firstName} {profileData.lastName}
                </Typography>
                {profileData.verificationStatus && (
                  <Chip 
                    icon={<VerifiedIcon />}
                    label="Verified"
                    color="success"
                    size="small"
                  />
                )}
              </Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {profileData.companyName}
              </Typography>
              <Typography variant="body1" color="primary" sx={{ fontWeight: 'medium', mb: 1 }}>
                {profileData.professionalTypeName}
              </Typography>
              {profileData.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {profileData.email}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            {/* Professional Type Details */}
            <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StarIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6">Professional Type</Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                  {profileData.professionalTypeName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profileData.professionalTypeDescription}
                </Typography>
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BusinessIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6">Business Information</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Company Name
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {profileData.companyName || "Not Set"}
                    </Typography>
                  </Grid>
                  
                  {profileData.abn && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Australian Business Number (ABN)
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {profileData.abn}
                      </Typography>
                    </Grid>
                  )}
                  
                  {profileData.licenseNumber && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        License Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {profileData.licenseNumber}
                      </Typography>
                    </Grid>
                  )}
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Verification Status
                    </Typography>
                    <Chip 
                      label={profileData.verificationStatus ? "Verified" : "Not Verified"}
                      color={profileData.verificationStatus ? "success" : "default"}
                      size="small"
                      icon={profileData.verificationStatus ? <VerifiedIcon /> : undefined}
                      sx={{ mt: 0.5 }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>
            {/* Service Areas */}
            <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOnIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6">Service Areas</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Regions
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {profileData.regions && profileData.regions.length > 0 ? (
                    profileData.regions.map((region, index) => (
                      <Chip 
                        key={index}
                        label={region}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No regions specified
                    </Typography>
                  )}
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  States
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profileData.states && profileData.states.length > 0 ? (
                    profileData.states.map((stateId) => (
                      <Chip 
                        key={stateId}
                        label={getStateName(stateId)}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No states specified
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Specialisations */}
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Specialisations
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profileData.specialisations && profileData.specialisations.length > 0 ? (
                    profileData.specialisations.map((specialisationId) => (
                      <Chip 
                        key={specialisationId}
                        label={getSpecialisationName(specialisationId)}
                        size="medium"
                        color="primary"
                        variant="filled"
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No specialisations specified
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfessionalPublicProfile;
