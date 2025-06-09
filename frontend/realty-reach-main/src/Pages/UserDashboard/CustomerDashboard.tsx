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
  Container
} from "@mui/material";
import { 
  Menu as MenuIcon, 
  Notifications as NotificationsIcon, 
  Add as AddIcon 
} from "@mui/icons-material";
import Sidebar from "../../SharedComponents/Sidebar";
import Metrics from "../../Components/Metrics";
import ActiveJobsSection from "../../SharedComponents/ActiveJobsSection";
import NotificationsDrawer from "../../Components/NotificationsDrawer";
import CreateJobModal from "../../SharedComponents/CreateJobModal";
import { UserContext} from "../../Context/userContext";

const CustomerDashboard: React.FC = () => {
  const { user } = useContext(UserContext)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
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
            
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>
            
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
              Welcome, {user?.FirstName}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Dashboard Content */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setIsCreateJobModalOpen(true)}
              size="large"
            >
              Create New Job
            </Button>
          </Box>

          <Metrics />
          <ActiveJobsSection />
        </Container>
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
