import React, { useEffect, useState, useContext } from "react";
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
  Avatar,
  Button
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
import { UserContext } from "../../Context/userContext";
import { getAvailableJobsForProfessional, getFinalisedJobsForProfessional } from "../../services/JobService";
import { Job } from "../../Models/Job";
import { FinalisedJob } from "../../Models/FinalisedJob";
import { ProfessionalProfile, ProfessionalTypeEnumMapping } from "../../Models/User";
import { useNavigate } from "react-router-dom";
import { backendApi } from "../../api/backendApi";

interface ProfessionalData {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  abn: string;
  licenseNumber: string;
  professionalTypeId: number;
  professionalType: string;
  verificationStatus: boolean;
  firstLogin: boolean;
}

const ProfessionalDashboard: React.FC = () => {
  const { user } = useContext(UserContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [finalisedJobs, setFinalisedJobs] = useState<FinalisedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [professionalData, setProfessionalData] = useState<ProfessionalData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  // Get professional type display name
  const getProfessionalTypeDisplay = () => {
    if (professionalData?.professionalTypeId) {
      const typeKey = professionalData.professionalTypeId.toString();
      return ProfessionalTypeEnumMapping[typeKey as unknown as keyof typeof ProfessionalTypeEnumMapping] || "Not Set";
    }
    return "Not Set";
  };
  
  // Fetch professional profile data
  useEffect(() => {
    const fetchProfessionalProfile = async () => {
      try {
        const response = await backendApi.get<ProfessionalData>('/api/Professional');
        setProfessionalData(response.data);
      } catch (error) {
        console.error("Error fetching professional profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    
    fetchProfessionalProfile();
  }, []);
  
  useEffect(() => {
    // const fetchAvailableJobs = async () => {
    //   if (user?.Id) {
    //     try {
    //       const jobs = await getAvailableJobsForProfessional(user.Id);
    //       setAvailableJobs(jobs);
    //     } catch (error) {
    //       console.error("Error fetching available jobs:", error);
    //     } finally {
    //       setIsLoading(false);
    //     }
    //   }
    // };
    const fetchFinalisedJobs = async () => {
      try {
        const jobs = await getFinalisedJobsForProfessional();
        setFinalisedJobs(jobs);
      } catch (error) {
        console.error("Error fetching finalised jobs:", error);
      }
    };
    //fetchAvailableJobs();
    fetchFinalisedJobs();
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
      title: "High Quality Leads", 
      value: finalisedJobs.length, 
      icon: <CheckCircleIcon fontSize="large" sx={{ color: theme.palette.success.main }} />, 
      bgColor: theme.palette.success.light
    },
    { 
      title: "Active Responses", 
      value: 0, 
      icon: <BuildIcon fontSize="large" color="secondary" />, 
      bgColor: theme.palette.secondary.light
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
                  {(professionalData?.firstName || user?.FirstName)?.charAt(0)}
                  {(professionalData?.lastName || user?.LastName)?.charAt(0)}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h5" gutterBottom>
                  {professionalData?.firstName || user?.FirstName} {professionalData?.lastName || user?.LastName}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {professionalData?.companyName || "Company Name Not Set"}
                </Typography>
                <Typography variant="body2" color="primary" sx={{ fontWeight: 'medium', mb: 1 }}>
                  {isLoadingProfile ? "Loading..." : getProfessionalTypeDisplay()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ABN: {professionalData?.abn || "Not Set"} | License: {professionalData?.licenseNumber || "Not Set"}
                </Typography>
              </Grid>
              <Grid item>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/professional/profile/edit')}
                  sx={{ minWidth: 120 }}
                >
                  Edit Profile
                </Button>
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
          
          {/* High Quality Leads Preview */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              High Quality Leads (Finalised Jobs)
            </Typography>
            {finalisedJobs.length > 0 ? (
              <Grid container spacing={2}>
                {finalisedJobs.slice(0, 3).map((job) => (
                  <Grid item xs={12} sm={6} md={4} key={job.jobId}>
                    <Card elevation={1} sx={{ height: '100%' }}>
                      <CardActionArea sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom noWrap>
                            {job.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Type: {job.jobType} • {job.propertyType}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Region: {job.region} | State: {job.state}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Specialisation: {job.specialisation}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Customer: {job.customerEmail} | {job.customerPhone}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Assigned: {new Date(job.assignedDate).toLocaleDateString()}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2">No high quality leads found yet.</Typography>
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
