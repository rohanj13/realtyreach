import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Badge,
  Drawer,
  useMediaQuery,
  useTheme,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Avatar
} from "@mui/material";
import { 
  Menu as MenuIcon, 
  Notifications as NotificationsIcon,
  Article as ArticleIcon,
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon
} from "@mui/icons-material";
import Sidebar from "../../SharedComponents/Sidebar";
import NotificationsDrawer from "../../Components/NotificationsDrawer";
import { useAuth } from "../../Context/useAuth";
import { getAvailableJobsForProfessional } from "../../services/JobService";
import { Job } from "../../Models/Job";
import { ProfessionalProfile } from "../../Models/User";

const ProfessionalDashboard: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const professionalUser = user as ProfessionalProfile;
  
  useEffect(() => {
    const fetchAvailableJobs = async () => {
      if (user?.Id) {
        try {
          const jobs = await getAvailableJobsForProfessional(user.Id);
          setAvailableJobs(jobs);
        } catch (error) {
          console.error("Error fetching available jobs:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchAvailableJobs();
  }, [user]);
  
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const metrics = [
    { 
      title: "Available Jobs", 
      value: availableJobs.length, 
      icon: <ArticleIcon fontSize="large" color="primary" />,
      bgColor: theme.palette.primary.light
    },
    { 
      title: "Active Responses", 
      value: 0, 
      icon: <BuildIcon fontSize="large" color="secondary" />,
      bgColor: theme.palette.secondary.light
    },
    { 
      title: "Completed Jobs", 
      value: 0, 
      icon: <CheckCircleIcon fontSize="large" sx={{ color: theme.palette.success.main }} />,
      bgColor: theme.palette.success.light
    },
    { 
      title: "Response Rate", 
      value: "0%", 
      icon: <TrendingUpIcon fontSize="large" sx={{ color: theme.palette.info.main }} />,
      bgColor: theme.palette.info.light
    }
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar - permanent on desktop, drawer on mobile */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={isMobileSidebarOpen}
          onClose={toggleMobileSidebar}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
        >
          <Sidebar variant="temporary" onClose={toggleMobileSidebar} />
        </Drawer>
      ) : (
        <Sidebar />
      )}

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {/* App Bar */}
        <AppBar 
          position="static" 
          color="default" 
          elevation={0}
          sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleMobileSidebar}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Professional Dashboard
            </Typography>
            
            <IconButton 
              color="inherit"
              onClick={() => setIsNotificationsOpen(true)}
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={2} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <Typography variant="subtitle2" sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
              Welcome, {user?.FirstName || "Professional"}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Dashboard Content */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* Professional Profile Summary Card */}
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: theme.palette.primary.main 
                  }}
                >
                  {user?.FirstName?.charAt(0)}{user?.LastName?.charAt(0)}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h5" gutterBottom>
                  {user?.FirstName} {user?.LastName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {professionalUser?.CompanyName || "Company Name Not Set"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  ABN: {professionalUser?.ABN || "Not Set"} | License: {professionalUser?.LicenseNumber || "Not Set"}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Metrics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {metrics.map((metric, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card elevation={2} sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ textAlign: 'center', pb: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      mb: 2,
                      p: 1.5,
                      borderRadius: '50%',
                      backgroundColor: metric.bgColor
                    }}>
                      {metric.icon}
                    </Box>
                    <Typography variant="h4" component="div">
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metric.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Recent Available Jobs Preview */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Recent Available Jobs
            </Typography>
            
            {isLoading ? (
              <Typography variant="body2">Loading available jobs...</Typography>
            ) : availableJobs.length > 0 ? (
              <Grid container spacing={2}>
                {availableJobs.slice(0, 3).map((job) => (
                  <Grid item xs={12} sm={6} md={4} key={job.jobId}>
                    <Card elevation={1} sx={{ height: '100%' }}>
                      <CardActionArea 
                        sx={{ height: '100%' }}
                        onClick={() => {/* Navigate to job details */}}
                      >
                        <CardContent>
                          <Typography variant="h6" gutterBottom noWrap>
                            {job.JobTitle}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Type: {job.JobType} • {job.PropertyType}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Budget: ${job.BudgetMin.toLocaleString()} - ${job.BudgetMax.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Location: {job.Postcode}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2">No available jobs found matching your profession.</Typography>
            )}
          </Paper>
        </Container>
      </Box>

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </Box>
  );
};

export default ProfessionalDashboard;
