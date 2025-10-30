import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Avatar,
  Divider,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Email,
  Badge,
  LocationOn,
  Business,
  Verified,
  CheckCircle,
  Person,
} from '@mui/icons-material';
import { Professional } from '../Models/Professional';
import { useNavigate } from 'react-router-dom';
import { getStateName } from '@/helpers/getStateName';
import { getSpecialisationName } from '@/helpers/getSpecialisationName';

interface MatchedProfessionalsProps {
  professionals: Professional[];
  onFinalizeMatch: (professionalId: string) => void;
  isLoading?: boolean;
}

const MatchedProfessionals: React.FC<MatchedProfessionalsProps> = ({
  professionals = [],
  onFinalizeMatch,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  const handleViewProfile = (professionalId: string) => {
    navigate(`/professional/${professionalId}`);
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 6, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Loading matched professionals...
        </Typography>
      </Box>
    );
  }

  if (professionals.length === 0) {
    return (
      <Box 
        sx={{ 
          p: 6, 
          textAlign: 'center',
          bgcolor: 'background.paper',
          borderRadius: 3,
          border: '2px dashed',
          borderColor: 'divider',
        }}
      >
        <Person sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
          No Professionals Found
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          We'll notify you when matching professionals become available
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {professionals.map((prof) => (
        <Grid item xs={12} md={6} lg={4} key={prof.id}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-4px)',
                borderColor: 'primary.main',
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              {/* Header with Avatar */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    mr: 2,
                    border: '3px solid',
                    borderColor: 'primary.light',
                  }}
                  src={`https://ui-avatars.com/api/?name=${prof.firstName}+${prof.lastName}&background=1976d2&color=fff&size=128`}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {prof.firstName} {prof.lastName}
                  </Typography>
                  {prof.companyName && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Business sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {prof.companyName}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Professional Details */}
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Badge sx={{ color: 'text.secondary', fontSize: 18 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {prof.professionalTypeId}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ color: 'text.secondary', fontSize: 18 }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {prof.email}
                  </Typography>
                </Box>

                {prof.abn && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Business sx={{ color: 'text.secondary', fontSize: 18 }} />
                    <Typography variant="body2">
                      ABN: {prof.abn}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Verified 
                    sx={{ 
                      color: prof.verificationStatus ? 'success.main' : 'text.disabled',
                      fontSize: 18 
                    }} 
                  />
                  <Chip
                    label={prof.verificationStatus ? 'Verified' : 'Not Verified'}
                    size="small"
                    color={prof.verificationStatus ? 'success' : 'default'}
                    variant="outlined"
                  />
                </Box>

                {prof.regions && prof.regions.length > 0 && (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <LocationOn sx={{ color: 'text.secondary', fontSize: 18 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        REGIONS
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 3.5 }}>
                      <Typography variant="body2">
                        {prof.regions.slice(0, 2).join(', ')}
                        {prof.regions.length > 2 && ` +${prof.regions.length - 2} more`}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {prof.states && prof.states.length > 0 && (
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', ml: 3.5, display: 'block', mb: 0.5 }}>
                      STATES
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} sx={{ ml: 3.5 }}>
                      {prof.states.map((state, idx) => (
                        <Chip
                          key={idx}
                          label={getStateName(state)}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {prof.specialisations && prof.specialisations.length > 0 && (
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                      SPECIALISATIONS
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                      {prof.specialisations.slice(0, 3).map((spec, idx) => (
                        <Chip
                          key={idx}
                          label={getSpecialisationName(spec)}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                      {prof.specialisations.length > 3 && (
                        <Chip
                          label={`+${prof.specialisations.length - 3}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </CardContent>

            {/* Action Buttons */}
            <Box sx={{ p: 2, pt: 0 }}>
              <Stack spacing={1}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => onFinalizeMatch(prof.id)}
                  startIcon={<CheckCircle />}
                  sx={{
                    py: 1.2,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                  }}
                >
                  Select Professional
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleViewProfile(prof.id)}
                  sx={{
                    py: 1.2,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                  }}
                >
                  View Full Profile
                </Button>
              </Stack>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MatchedProfessionals;