import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Rating,
  Button,
  Avatar,
  Divider,
  Paper,
} from '@mui/material';
import { MatchedProfessional } from '../Models/Professional';
import { useNavigate } from 'react-router-dom';

interface MatchedProfessionalsProps {
  matchedProfessionals: MatchedProfessional[];
  onFinalizeMatch: (professionalId: string) => void;
  isLoading?: boolean;
}

const MatchedProfessionals: React.FC<MatchedProfessionalsProps> = ({
  matchedProfessionals,
  onFinalizeMatch,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  const handleViewProfile = (professionalId: string) => {
    navigate(`/professional/${professionalId}`);
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading matched professionals...</Typography>
      </Box>
    );
  }

  if (matchedProfessionals.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>No matched professionals found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Matched Professionals
      </Typography>
      <Grid container spacing={3}>
        {matchedProfessionals.map((match) => (
          <Grid item xs={12} md={6} key={match.professional.id}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{ width: 60, height: 60, mr: 2 }}
                    src={`https://ui-avatars.com/api/?name=${match.professional.firstName}+${match.professional.lastName}`}
                  />
                  <Box>
                    <Typography variant="h6">
                      {match.professional.firstName} {match.professional.lastName}
                    </Typography>
                    <Typography color="textSecondary">
                      {match.professional.companyName}
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 'auto' }}>
                    <Chip
                      label={`${Math.round(match.matchScore * 100)}% Match`}
                      color="primary"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Match Reasons:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {match.matchReasons.map((reason, index) => (
                      <Chip
                        key={index}
                        label={reason}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Specializations:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {match.professional.specialisations?.map((spec, index) => (
                      <Chip
                        key={index}
                        label={spec}
                        size="small"
                        color="secondary"
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating
                    value={match.professional.rating || 0}
                    readOnly
                    precision={0.5}
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    ({match.professional.reviewCount || 0} reviews)
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => handleViewProfile(match.professional.id)}
                  >
                    View Profile
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onFinalizeMatch(match.professional.id)}
                  >
                    Select Professional
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MatchedProfessionals; 