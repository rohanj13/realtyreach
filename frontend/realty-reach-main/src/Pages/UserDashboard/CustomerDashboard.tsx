import React, { useEffect, useState, useContext } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Badge,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { 
  Menu as MenuIcon, 
  Notifications as NotificationsIcon, 
  Add as AddIcon 
} from "@mui/icons-material";
import Sidebar from "../../SharedComponents/Sidebar";
import Logo from "../../SharedComponents/Logo";
import Metrics from "../../Components/Metrics";
import ActiveJobsSection from "../../SharedComponents/ActiveJobsSection";
import { getAllJobsForCustomer } from "../../services/JobService";
import { Job } from "../../Models/Job";
import { useNavigate } from "react-router-dom";
import NotificationsDrawer from "../../Components/NotificationsDrawer";
import CreateJobModal from "../../SharedComponents/CreateJobModal";
import { UserContext} from "../../Context/userContext";
import { PageContainer, PageHeader, ActionButton } from "../../SharedComponents/UIComponents";

const CustomerDashboard: React.FC = () => {
  const { user } = useContext(UserContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user?.id) return;
      try {
        const fetchedJobs = await getAllJobsForCustomer(user.id);
        setJobs(fetchedJobs);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchJobs();
  }, [user]);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleViewDetails = (jobId: number) => {
    navigate(`/job/${jobId}/matches`);
  };

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
            
            <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
              <Logo variant="compact" size="small" color="inherit" />
            </Box>
            
            <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexGrow: 1 }}>
              <Logo variant="icon-only" size="small" color="inherit" />
            </Box>
            
            <IconButton 
              color="inherit"
              onClick={() => setIsNotificationsOpen(true)}
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <Typography variant="subtitle2" sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
              Welcome, {user?.firstName}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Dashboard Content */}
        <PageContainer>
          <PageHeader 
            title="Dashboard"
            subtitle={`Welcome back, ${user?.firstName}`}
            actions={
              <ActionButton
                label="Create New Job"
                icon={<AddIcon />}
                onClick={() => setIsCreateJobModalOpen(true)}
                size="large"
              />
            }
          />

          <Metrics />
          <ActiveJobsSection jobs={jobs} onViewDetails={handleViewDetails} />
        </PageContainer>
      </Box>

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
      
      {/* Create Job Modal */}
      <CreateJobModal
        isOpen={isCreateJobModalOpen}
        onClose={() => setIsCreateJobModalOpen(false)}
      />
    </Box>
  );
};

export default CustomerDashboard;
