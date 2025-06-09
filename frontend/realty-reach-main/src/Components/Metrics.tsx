import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  useTheme 
} from '@mui/material';
import { 
  Business as BusinessIcon, 
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

interface MetricCardProps {
  label: string;
  count: number;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, count, description, icon, color }) => {
  return (
    <Card sx={{ height: '100%', borderTop: `4px solid ${color}` }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="div" fontWeight="medium">
            {label}
          </Typography>
          <Box sx={{ color }}>
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" component="div" fontWeight="bold" sx={{ mb: 1 }}>
          {count}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Metrics: React.FC = () => {
  const theme = useTheme();
  
  const metrics = [
    {
      label: "Active Jobs",
      count: 3,
      description: "2 requiring action",
      icon: <BusinessIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: "New Quotes",
      count: 5,
      description: "Last 7 days",
      icon: <TrendingUpIcon />,
      color: theme.palette.success.main,
    },
    {
      label: "Connected Pros",
      count: 8,
      description: "Across all jobs",
      icon: <GroupIcon />,
      color: theme.palette.secondary.main,
    },
    {
      label: "Pending Docs",
      count: 4,
      description: "Need review",
      icon: <DescriptionIcon />,
      color: theme.palette.warning.main,
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight="medium" sx={{ mb: 2 }}>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Metrics;
