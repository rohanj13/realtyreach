import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  Chip,
  Stack,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Button,
} from '@mui/material';
import {
  BusinessCenter,
  AttachMoney,
  LocationOn,
  CalendarToday,
  Category,
  CheckCircle,
  Email,
  Badge,
  Verified,
  Business,
  Person,
} from '@mui/icons-material';
import MatchedProfessionals from '../../Components/MatchedProfessionals';
import ProfessionalProfileModal from '../../Components/ProfessionalProfileModal';
import { getMatchedProfessionals, finalizeMatch } from '../../services/JobService';
import { getJobById } from '../../services/JobService';
import { Job } from '../../Models/Job';
import { JobInfo } from '../../Models/Job';
import { FinalisedJob } from '../../Models/FinalisedJob';
import { JobMatches } from '../../Models/Job';
import { MatchingJobDto } from '../../Models/Job';
import { Professional } from '@/Models/Professional';
import { getStateName } from '@/helpers/getStateName';
import { getSpecialisationName } from '@/helpers/getSpecialisationName';
import { ProfessionalTypeEnum, ProfessionalTypeEnumMapping } from '@/Models/User';

const JobProfMatches: React.FC = () => {
  const handleBack = () => {
    navigate('/customerdashboard');
  };
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [matchedProfessionals, setMatchedProfessionals] = useState<Professional[]>([]);
  const [finalisedProfessionals, setFinalisedProfessionals] = useState<Professional[]>([]);
  const [jobDetails, setJobDetails] = useState<JobInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        if (!jobId) return;
        setIsLoading(true);
        const jobMatches: JobMatches = await getMatchedProfessionals(parseInt(jobId));
        setJobDetails(jobMatches.job);
        setMatchedProfessionals(jobMatches.suggestedProfessionals || []);
        setFinalisedProfessionals(jobMatches.finalisedProfessionals || []);
      } catch (err) {
        setError('Failed to fetch job or professionals');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobData();
  }, [jobId]);

  const handleFinalizeMatch = async (professionalId: string) => {
    try {
      if (!jobId) return;
      
      const matchingData: MatchingJobDto = {
        jobId: parseInt(jobId),
        professionalId: professionalId,
      };

      await finalizeMatch(matchingData);
      
      // Move professional from matched to finalised
      const finalisedProf = matchedProfessionals.find(p => p.id === professionalId);
      if (finalisedProf) {
        setFinalisedProfessionals(prev => [...prev, finalisedProf]);
        setMatchedProfessionals(prev => prev.filter(p => p.id !== professionalId));
      }
      
      setSuccessMessage('Successfully matched with professional!');
    } catch (err) {
      setError('Failed to finalize match');
      console.error(err);
    }
  };

  const handleViewProfile = (professionalId: string) => {
    setSelectedProfessionalId(professionalId);
    setIsProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
    setSelectedProfessionalId(null);
  };

  const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | React.ReactNode }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1.5 }}>
      <Box sx={{ color: 'primary.main', mt: 0.2, minWidth: 20, display: 'flex' }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 600, mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );

  const ProfessionalCard = ({ prof, isFinalised = false }: { prof: Professional; isFinalised?: boolean }) => (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: '1px solid',
        borderColor: isFinalised ? 'success.main' : 'divider',
        transition: 'all 0.3s ease',
        bgcolor: isFinalised ? 'success.50' : 'background.paper',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)',
          borderColor: isFinalised ? 'success.dark' : 'primary.main',
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
              borderColor: isFinalised ? 'success.main' : 'primary.light',
            }}
            src={`https://ui-avatars.com/api/?name=${prof.firstName}+${prof.lastName}&background=${isFinalised ? '2e7d32' : '1976d2'}&color=fff&size=128`}
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
          {isFinalised && (
            <CheckCircle sx={{ color: 'success.main', fontSize: 28 }} />
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Professional Details */}
        <Stack spacing={1.5}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Badge sx={{ color: 'text.secondary', fontSize: 18 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {ProfessionalTypeEnumMapping[prof.professionalTypeId as ProfessionalTypeEnum]}
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
          {!isFinalised && (
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleFinalizeMatch(prof.id)}
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
          )}
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
  );

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 2 }}>
          <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
            ← Back to Dashboard
          </Button>
        </Box>
        {/* Job Details Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            mb: 4, 
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            p: 3,
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {jobDetails ? jobDetails.jobTitle : 'Job Details'}
            </Typography>
            {jobDetails && (
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Chip 
                  label={jobDetails.jobType} 
                  size="small" 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
                />
                <Chip 
                  label={jobDetails.status} 
                  size="small" 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
                />
              </Stack>
            )}
          </Box>

          {jobDetails ? (
            <Grid container>
              <Grid item xs={12} lg={8}>
                <Box sx={{ p: 3, borderRight: { lg: '1px solid' }, borderColor: { lg: 'divider' } }}>
                  <InfoRow 
                    icon={<BusinessCenter sx={{ fontSize: 20 }} />}
                    label="Property Type"
                    value={jobDetails.propertyType}
                  />
                  
                  {jobDetails.purchaseType && (
                    <InfoRow 
                      icon={<Category sx={{ fontSize: 20 }} />}
                      label="Purchase Type"
                      value={jobDetails.purchaseType}
                    />
                  )}

                  <InfoRow 
                    icon={<AttachMoney sx={{ fontSize: 20 }} />}
                    label="Budget Range"
                    value={`$${jobDetails.budgetMin.toLocaleString()} - $${jobDetails.budgetMax.toLocaleString()}`}
                  />

                  <InfoRow 
                    icon={<LocationOn sx={{ fontSize: 20 }} />}
                    label="Locations"
                    value={
                      <Box>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Regions:</strong> {jobDetails.regions.join(', ')}
                        </Typography>
                        <Typography variant="body2">
                          <strong>States:</strong> {jobDetails.states.map(getStateName).join(', ')}
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Box sx={{ p: 3 }}>
                  <InfoRow 
                    icon={<Category sx={{ fontSize: 20 }} />}
                    label="Specialisations"
                    value={
                      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        {jobDetails.specialisations.map((spec, idx) => (
                          <Chip 
                            key={idx}
                            label={getSpecialisationName(spec)} 
                            size="small" 
                            variant="outlined"
                            sx={{ fontWeight: 500 }}
                          />
                        ))}
                      </Stack>
                    }
                  />

                  {jobDetails.additionalDetails && (
                    <InfoRow 
                      icon={<BusinessCenter sx={{ fontSize: 20 }} />}
                      label="Additional Details"
                      value={jobDetails.additionalDetails}
                    />
                  )}

                  <InfoRow 
                    icon={<CalendarToday sx={{ fontSize: 20 }} />}
                    label="Created"
                    value={new Date(jobDetails.createdAt).toLocaleDateString('en-AU', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  />
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <CircularProgress />
            </Box>
          )}
        </Paper>

        {/* Two Column Layout for Professionals */}
        <Grid container spacing={3}>
          {/* Suggested Professionals - Left Side */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                Suggested Professionals
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Review and select the best professional match for your job
              </Typography>
            </Box>
            
            {(isLoading && matchedProfessionals.length === 0) ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : matchedProfessionals.length === 0 ? (
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
            ) : (
              <Grid container spacing={3}>
                {matchedProfessionals.map((prof) => (
                  <Grid item xs={12} md={6} key={prof.id}>
                    <ProfessionalCard prof={prof} isFinalised={false} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>

          {/* Finalised Professionals - Right Side */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ mb: 2, position: 'sticky', top: 16 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                Finalised Professionals
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Professionals you've selected for this job
              </Typography>
              
              {finalisedProfessionals.length === 0 ? (
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    textAlign: 'center', 
                    borderRadius: 3,
                    border: '2px dashed',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                  }}
                >
                  <CheckCircle sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1, fontSize: '1rem' }}>
                    No Finalised Professionals Yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Select professionals from the suggested list
                  </Typography>
                </Paper>
              ) : (
                <Stack spacing={3}>
                  {finalisedProfessionals.map((prof) => (
                    <ProfessionalCard key={prof.id} prof={prof} isFinalised={true} />
                  ))}
                </Stack>
              )}
            </Box>
          </Grid>
        </Grid>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            severity="error" 
            onClose={() => setError(null)}
            sx={{ boxShadow: 4 }}
          >
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            severity="success" 
            onClose={() => setSuccessMessage(null)}
            sx={{ boxShadow: 4 }}
          >
            {successMessage}
          </Alert>
        </Snackbar>

        {/* Professional Profile Modal */}
        <ProfessionalProfileModal
          open={isProfileModalOpen}
          onClose={handleCloseProfileModal}
          professionalId={selectedProfessionalId}
        />
      </Container>
    </Box>
  );
};

export default JobProfMatches;