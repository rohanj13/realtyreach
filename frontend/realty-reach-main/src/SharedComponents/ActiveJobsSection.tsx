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

interface JobStatus {
  label: string;
  color: "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

interface JobInfo {
  id: string;
  address: string;
  type: string;
  status: JobStatus;
  createdDate: string;
  alerts: {
    icon: React.ReactNode;
    message: string;
  }[];
}

interface JobCardProps {
  job: JobInfo;
  onViewDetails: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h6" component="div" sx={{ mb: 0.5 }}>
            {job.address}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {job.type}
          </Typography>
        </Box>
        <Chip 
          label={job.status.label} 
          color={job.status.color} 
          size="small"
          sx={{ height: 24 }}
        />
      </Box>
      
      <Divider sx={{ my: 1.5 }} />
      
      <Stack spacing={1.5} sx={{ mt: 2 }}>
        {job.alerts.map((alert, index) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }} key={index}>
            {alert.icon}
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {alert.message}
            </Typography>
          </Box>
        ))}
      </Stack>
    </CardContent>
    
    <CardActions>
      <Button 
        variant="outlined" 
        fullWidth 
        onClick={() => onViewDetails(job.id)}
        color="primary"
      >
        View Job Details
      </Button>
    </CardActions>
  </Card>
);

const ActiveJobsSection: React.FC = () => {
  const jobs: JobInfo[] = [
    {
      id: '1',
      address: '123 Richmond St, Richmond',
      type: 'Property Purchase',
      status: {
        label: '4 New Quotes',
        color: 'warning',
      },
      createdDate: 'Dec 15, 2024',
      alerts: [
        {
          icon: <ClockIcon fontSize="small" color="action" />,
          message: 'Created: Dec 15, 2024'
        },
        {
          icon: <AlertIcon fontSize="small" color="action" />,
          message: '3 professionals awaiting response'
        }
      ]
    },
    {
      id: '2',
      address: '45 Brunswick Rd, Brunswick',
      type: 'Property Sale',
      status: {
        label: 'In Progress',
        color: 'success',
      },
      createdDate: 'Nov 28, 2024',
      alerts: [
        {
          icon: <ClockIcon fontSize="small" color="action" />,
          message: 'Created: Nov 28, 2024'
        },
        {
          icon: <FileIcon fontSize="small" color="action" />,
          message: '2 documents need review'
        }
      ]
    }
  ];

  const handleViewDetails = (jobId: string) => {
    console.log(`Viewing details for job ${jobId}`);
    // Add navigation logic here, e.g., navigate(`/job/${jobId}`);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight="medium" sx={{ mb: 2 }}>
        Active Property Jobs
      </Typography>
      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} sm={6} md={6} key={job.id}>
            <JobCard job={job} onViewDetails={handleViewDetails} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ActiveJobsSection;
