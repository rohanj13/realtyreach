import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import MatchedProfessionals from '../../Components/MatchedProfessionals';
import { getMatchedProfessionals, finalizeMatch } from '../../services/JobService';
import { MatchedProfessional } from '../../Models/Professional';
import { MatchingJobDto } from '../../Models/Job';

const JobMatches: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [matchedProfessionals, setMatchedProfessionals] = useState<MatchedProfessional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatchedProfessionals = async () => {
      try {
        if (!jobId) return;
        const matches = await getMatchedProfessionals(parseInt(jobId));
        setMatchedProfessionals(matches);
      } catch (err) {
        setError('Failed to fetch matched professionals');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatchedProfessionals();
  }, [jobId]);

  const handleFinalizeMatch = async (professionalId: string) => {
    try {
      if (!jobId) return;
      
      const matchingData: MatchingJobDto = {
        jobId: parseInt(jobId),
        professionalId: professionalId,
      };

      await finalizeMatch(matchingData);
      setSuccessMessage('Successfully matched with professional!');
      
      // Navigate back to jobs list after a short delay
      setTimeout(() => {
        navigate('/dashboard/jobs');
      }, 2000);
    } catch (err) {
      setError('Failed to finalize match');
      console.error(err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Matched Professionals for Job #{jobId}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Review and select from the matched professionals below
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <MatchedProfessionals
          matchedProfessionals={matchedProfessionals}
          onFinalizeMatch={handleFinalizeMatch}
        />
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default JobMatches; 