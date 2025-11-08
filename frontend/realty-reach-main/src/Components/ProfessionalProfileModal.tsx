import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Grid,
  Chip,
  Divider,
  Avatar,
  Card,
  CardContent,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  Verified as VerifiedIcon,
  Business as BusinessIcon,
  LocationOn as LocationOnIcon,
  Star as StarIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { backendApi } from "../api/backendApi";
import { ProfessionalProfileData } from "../Models/Professional";
import { getStateName } from "../helpers/getStateName";
import { getSpecialisationName } from "../helpers/getSpecialisationName";

interface ProfessionalProfileModalProps {
  open: boolean;
  onClose: () => void;
  professionalId: string | null;
}

const ProfessionalProfileModal: React.FC<ProfessionalProfileModalProps> = ({
  open,
  onClose,
  professionalId,
}) => {
  const theme = useTheme();
  const [profileData, setProfileData] = useState<ProfessionalProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!professionalId || !open) return;

      setIsLoading(true);
      setError("");

      try {
        const response = await backendApi.get<ProfessionalProfileData>(
          `/api/Professional/${professionalId}`
        );
        setProfileData(response.data);
      } catch (err: any) {
        console.error("Error fetching professional profile:", err);
        setError(err.response?.data?.Error || "Failed to load professional profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [professionalId, open]);

  const handleClose = () => {
    setProfileData(null);
    setError("");
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" component="span" sx={{ fontWeight: 600 }}>
          Professional Profile
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : profileData ? (
          <Box>
            {/* Profile Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: theme.palette.primary.main,
                  fontSize: '2rem',
                }}
              >
                {profileData.firstName?.charAt(0)}{profileData.lastName?.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
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
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {profileData.companyName}
                </Typography>
                <Typography variant="body2" color="primary" sx={{ fontWeight: 'medium' }}>
                  {profileData.professionalTypeName}
                </Typography>
                {profileData.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {profileData.email}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              {/* Professional Type Details */}
              <Grid item xs={12}>
                <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <StarIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 20 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Professional Type
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                      {profileData.professionalTypeName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {profileData.professionalTypeDescription}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Business Information */}
              <Grid item xs={12} md={6}>
                <Card elevation={0} variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <BusinessIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 20 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Business Information
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Company Name
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {profileData.companyName || "Not Set"}
                        </Typography>
                      </Box>

                      {profileData.abn && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            ABN
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {profileData.abn}
                          </Typography>
                        </Box>
                      )}

                      {profileData.licenseNumber && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            License Number
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {profileData.licenseNumber}
                          </Typography>
                        </Box>
                      )}

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Verification Status
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          <Chip
                            label={profileData.verificationStatus ? "Verified" : "Not Verified"}
                            color={profileData.verificationStatus ? "success" : "default"}
                            size="small"
                            icon={profileData.verificationStatus ? <VerifiedIcon /> : undefined}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Service Areas */}
              <Grid item xs={12} md={6}>
                <Card elevation={0} variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <LocationOnIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 20 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Service Areas
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        Regions
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
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
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        States
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
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
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Specialisations */}
              <Grid item xs={12}>
                <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                      Specialisations
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {profileData.specialisations && profileData.specialisations.length > 0 ? (
                        profileData.specialisations.map((specialisationId) => (
                          <Chip
                            key={specialisationId}
                            label={getSpecialisationName(specialisationId)}
                            size="small"
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
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ProfessionalProfileModal;
