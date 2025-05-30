import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import CreateJobForm from '../Components/CreateJobForm';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateJobModal: React.FC<CreateJobModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      aria-labelledby="create-job-dialog-title"
    >
      <DialogTitle id="create-job-dialog-title" sx={{ mb: 0, pb: 0 }}>
        Create a New Job
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 0, pt: 1 }}>
        <CreateJobForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobModal;
