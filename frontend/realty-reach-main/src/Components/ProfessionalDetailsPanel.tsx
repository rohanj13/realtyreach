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
  Button,
} from '@mui/material';
import { Close, CheckCircle, Cancel } from '@mui/icons-material';
import { Professional } from '@/Models/Professional';
import { AustralianState, Specialisation } from '@/Models/Job';
import { ProfessionalTypeEnum, ProfessionalTypeEnumMapping } from '@/Models/User';

interface ProfessionalDetailsPanelProps {
  professional: Professional;
  onClose: () => void;
  onVerify?: (id: string) => void;
  onReject?: (id: string) => void;
  actionLoading?: Record<string, string | null>;
}

const ProfessionalDetailsPanel: React.FC<ProfessionalDetailsPanelProps> = ({
  professional,
  onClose,
  onVerify,
  onReject,
  actionLoading = {},
}) => {
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
          Professional Details
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
                Personal Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Professional ID</Typography>
                  <Typography variant="body2" fontWeight="medium">{professional.id}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Name</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {professional.firstName} {professional.lastName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body2" fontWeight="medium">{professional.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Chip
                    label={professional.firstLogin ? 'New User' : 'Active'}
                    color={professional.firstLogin ? 'info' : 'default'}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, mb: 2, display: 'block' }}>
                Business Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Company Name</Typography>
                  <Typography variant="body2" fontWeight="medium">{professional.companyName || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">ABN</Typography>
                  <Typography variant="body2" fontWeight="medium">{professional.abn || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">License Number</Typography>
                  <Typography variant="body2" fontWeight="medium">{professional.licenseNumber || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Professional Type</Typography>
                  <Typography variant="body2" fontWeight="medium">{ProfessionalTypeEnumMapping[professional.professionalTypeId as ProfessionalTypeEnum]}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider />

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, mb: 2, display: 'block' }}>
              Service Areas
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Regions</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {professional.regions && professional.regions.length > 0 ? (
                    professional.regions.map((region, idx) => (
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
                  {professional.states && professional.states.length > 0 ? (
                    professional.states.map((state, idx) => (
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
                  {professional.specialisations && professional.specialisations.length > 0 ? (
                    professional.specialisations.map((spec, idx) => (
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
              Verification Status
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Chip
                icon={professional.verificationStatus ? <CheckCircle /> : <Cancel />}
                label={professional.verificationStatus ? 'Verified' : 'Unverified'}
                color={professional.verificationStatus ? 'success' : 'default'}
                size="medium"
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                {!professional.verificationStatus && onVerify && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={() => onVerify(professional.id)}
                    disabled={actionLoading[professional.id] === 'verify'}
                  >
                    Verify
                  </Button>
                )}
                {professional.verificationStatus && onReject && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Cancel />}
                    onClick={() => onReject(professional.id)}
                    disabled={actionLoading[professional.id] === 'reject'}
                  >
                    Reject
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfessionalDetailsPanel;
