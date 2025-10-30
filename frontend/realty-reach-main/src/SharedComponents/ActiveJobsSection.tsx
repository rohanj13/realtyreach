import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Chip, 
  Stack,
  Divider 
} from '@mui/material';
import { 
  AccessTime as ClockIcon, 
  Notifications as AlertIcon, 
  Description as FileIcon 
} from '@mui/icons-material';

import { Job } from '@/Models/Job';

interface ActiveJobsSectionProps {
  jobs: Job[];
  onViewDetails: (jobId: number) => void;
}

// JobInfo is not defined in Models/Job.ts, use Job type
type JobInfo = Job;

interface JobCardProps {
  job: JobInfo;
  onViewDetails: (jobId: number) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h6" component="div" sx={{ mb: 0.5 }}>
        {job.jobTitle}
      </Typography>
      <Typography color="text.secondary" variant="body2">
        {job.jobType}
      </Typography>
      <Typography color="text.secondary" variant="body2">
        Status: {job.status}
      </Typography>
      <Typography color="text.secondary" variant="body2">
        Property Type: {job.propertyType}
      </Typography>
      {job.purchaseType && (
        <Typography color="text.secondary" variant="body2">
          Purchase Type: {job.purchaseType}
        </Typography>
      )}
      <Typography color="text.secondary" variant="body2">
        Budget: ${job.budgetMin.toLocaleString()} - ${job.budgetMax.toLocaleString()}
      </Typography>
    </CardContent>
    <CardActions>
      <Button 
        variant="outlined" 
        fullWidth 
        onClick={() => onViewDetails(job.jobId)}
        color="primary"
      >
        View Job Details
      </Button>
    </CardActions>
  </Card>
);

const ActiveJobsSection: React.FC<ActiveJobsSectionProps> = ({ jobs, onViewDetails }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h5" fontWeight="medium" sx={{ mb: 2 }}>
      Active Property Jobs
    </Typography>
    <Grid container spacing={3}>
      {jobs.map((job) => (
        <Grid item xs={12} sm={6} md={6} key={job.jobId}>
          <JobCard job={job} onViewDetails={() => onViewDetails(job.jobId)} />
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default ActiveJobsSection;
