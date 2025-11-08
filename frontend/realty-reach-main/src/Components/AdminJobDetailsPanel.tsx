import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  Paper,
  Button,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { AustralianState, Job, Specialisation } from '@/Models/Job';

interface AdminJobDetailsPanelProps {
  job: Job;
  onClose: () => void;
}

const AdminJobDetailsPanel: React.FC<AdminJobDetailsPanelProps> = ({ job, onClose }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { maxHeight: '90vh' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h5" component="h2" fontWeight="bold">
          Job Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, mb: 2, display: 'block' }}>
                Basic Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Job ID</Typography>
                  <Typography variant="body2" fontWeight="medium">{job.jobId}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Title</Typography>
                  <Typography variant="body2" fontWeight="medium">{job.jobTitle}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Type</Typography>
                  <Typography variant="body2" fontWeight="medium">{job.jobType}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Chip
                    label="Active"
                    color="success"
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, mb: 2, display: 'block' }}>
                Property Details
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Property Type</Typography>
                  <Typography variant="body2" fontWeight="medium">{job.propertyType}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Purchase Type</Typography>
                  <Typography variant="body2" fontWeight="medium">{job.purchaseType}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Journey Progress</Typography>
                  <Typography variant="body2" fontWeight="medium">{job.journeyProgress}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Budget Range</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency(job.budgetMin)} - {formatCurrency(job.budgetMax)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider />

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, mb: 2, display: 'block' }}>
              Location
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Regions</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {job.regions && job.regions.length > 0 ? (
                    job.regions.map((region, idx) => (
                      <Chip key={idx} label={region} size="small" color="primary" variant="outlined" />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">No regions specified</Typography>
                  )}
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>States</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {job.states && job.states.length > 0 ? (
                    job.states.map((state, idx) => (
                      <Chip key={idx} label={AustralianState[state]} size="small" color="primary" variant="outlined" />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">No states specified</Typography>
                  )}
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Specialisations</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {job.specialisations && job.specialisations.length > 0 ? (
                    job.specialisations.map((spec, idx) => (
                      <Chip key={idx} label={Specialisation[spec]} size="small" color="secondary" variant="outlined" />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">No specialisations specified</Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, mb: 2, display: 'block' }}>
              Contact Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Email</Typography>
                <Typography variant="body2" fontWeight="medium">{job.contactEmail}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Phone</Typography>
                <Typography variant="body2" fontWeight="medium">{job.contactPhone}</Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, mb: 2, display: 'block' }}>
              Professionals
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Selected Professionals ({job.selectedProfessionals?.length || 0})
                </Typography>
                {job.selectedProfessionals && job.selectedProfessionals.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {job.selectedProfessionals.map((profId, idx) => (
                      <Chip key={idx} label={profId} size="small" color="success" variant="outlined" />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" fontStyle="italic">No professionals selected</Typography>
                )}
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Suggested Professionals ({job.suggestedProfessionalIds?.length || 0})
                </Typography>
                {job.suggestedProfessionalIds && job.suggestedProfessionalIds.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {job.suggestedProfessionalIds.map((profId, idx) => (
                      <Chip key={idx} label={profId} size="small" color="default" variant="outlined" />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" fontStyle="italic">No suggested professionals</Typography>
                )}
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, mb: 2, display: 'block' }}>
              Additional Details
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body2">{job.additionalDetails || 'No additional details provided'}</Typography>
            </Paper>
          </Box>

          <Divider />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Created</Typography>
              <Typography variant="body2" fontWeight="medium">
                {new Date(job.createdAt).toLocaleString('en-AU')}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminJobDetailsPanel;
