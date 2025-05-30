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
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Divider,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  AttachMoney as MoneyIcon,
  Home as HomeIcon,
  Map as MapIcon,
  Sort as SortIcon
} from "@mui/icons-material";
import Sidebar from "../../SharedComponents/Sidebar";
import NotificationsDrawer from "../../Components/NotificationsDrawer";
import { useAuth } from "../../Context/useAuth";
import { getAvailableJobsForProfessional, respondToJob } from "../../services/JobService";
import { Job } from "../../Models/Job";
import { ProfessionalProfile } from "../../Models/User";

const AvailableJobs: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterPropertyType, setFilterPropertyType] = useState("all");
  
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchAvailableJobs = async () => {
      if (user?.Id) {
        try {
          const jobs = await getAvailableJobsForProfessional(user.Id);
          setAvailableJobs(jobs);
          setFilteredJobs(jobs);
        } catch (error) {
          console.error("Error fetching available jobs:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchAvailableJobs();
  }, [user]);
  
  useEffect(() => {
    let result = [...availableJobs];
    
    // Apply search
    if (searchTerm) {
      result = result.filter(job => 
        job.JobTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
        job.AdditionalDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.Postcode.includes(searchTerm)
      );
    }
    
    // Apply property type filter
    if (filterPropertyType !== "all") {
      result = result.filter(job => job.PropertyType === filterPropertyType);
    }
    
    // Apply sorting
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.CreatedAt || "").getTime() - new Date(a.CreatedAt || "").getTime());
    } else if (sortBy === "budgetHigh") {
      result.sort((a, b) => b.BudgetMax - a.BudgetMax);
    } else if (sortBy === "budgetLow") {
      result.sort((a, b) => a.BudgetMin - b.BudgetMin);
    }
    
    setFilteredJobs(result);
  }, [searchTerm, sortBy, filterPropertyType, availableJobs]);
  
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setIsResponseDialogOpen(true);
  };

  const handleResponseSubmit = async () => {
    if (!selectedJob || !responseMessage.trim() || !user?.Id) return;
    
    setIsSubmitting(true);
    
    try {
      // Call the API to respond to the job
      await respondToJob({
        jobId: selectedJob.jobId,
        professionalId: user.Id,
        message: responseMessage
      });
      
      // Remove the job from the available jobs list
      setAvailableJobs(prev => prev.filter(job => job.jobId !== selectedJob.jobId));
      setFilteredJobs(prev => prev.filter(job => job.jobId !== selectedJob.jobId));
      
      // Close dialog and reset
      setIsResponseDialogOpen(false);
      setResponseMessage("");
      setSelectedJob(null);
      
      // Show success notification
      alert("Your response has been sent successfully!");
    } catch (error) {
      console.error("Error sending job response:", error);
      alert("Failed to send your response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const propertyTypeOptions = [
    { value: "all", label: "All Property Types" },
    { value: "House", label: "House" },
    { value: "Apartment", label: "Apartment" },
    { value: "Townhouse", label: "Townhouse" },
    { value: "Land", label: "Land" },
    { value: "Commercial", label: "Commercial" }
  ];
  
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "budgetHigh", label: "Highest Budget" },
    { value: "budgetLow", label: "Lowest Budget" }
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
              Available Jobs
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

        {/* Job Listings Content */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* Filters Section */}
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search by job title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined">
                  <Select
                    value={filterPropertyType}
                    onChange={(e) => setFilterPropertyType(e.target.value)}
                    displayEmpty
                    startAdornment={
                      <InputAdornment position="start">
                        <HomeIcon color="action" />
                      </InputAdornment>
                    }
                  >
                    {propertyTypeOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined">
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    displayEmpty
                    startAdornment={
                      <InputAdornment position="start">
                        <SortIcon color="action" />
                      </InputAdornment>
                    }
                  >
                    {sortOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Job Listings */}
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredJobs.length > 0 ? (
            <Grid container spacing={3}>
              {filteredJobs.map((job) => (
                <Grid item xs={12} key={job.jobId}>
                  <Card elevation={2} sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <Box>
                          <Typography variant="h5" component="h2" gutterBottom>
                            {job.JobTitle}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            <Chip 
                              icon={<HomeIcon />} 
                              label={job.PropertyType} 
                              size="small" 
                              color="primary" 
                              variant="outlined" 
                            />
                            <Chip 
                              icon={<MoneyIcon />} 
                              label={`$${job.BudgetMin.toLocaleString()} - $${job.BudgetMax.toLocaleString()}`} 
                              size="small" 
                              color="success" 
                              variant="outlined" 
                            />
                            <Chip 
                              icon={<MapIcon />} 
                              label={job.Postcode} 
                              size="small" 
                              variant="outlined" 
                            />
                          </Box>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Posted: {job.CreatedAt ? new Date(job.CreatedAt).toLocaleDateString() : "Recently"}
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ my: 1.5 }} />
                      
                      <Typography variant="body1" paragraph>
                        {job.AdditionalDetails || "No additional details provided."}
                      </Typography>
                      
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Job Details:
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Typography variant="body2">
                            <strong>Job Type:</strong> {job.JobType}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <Typography variant="body2">
                            <strong>Purchase Type:</strong> {job.PurchaseType}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <Typography variant="body2">
                            <strong>Journey Progress:</strong> {job.JourneyProgress}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => handleViewJob(job)}
                      >
                        Respond to Job
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper elevation={2} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No available jobs found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                There are no jobs matching your criteria at the moment. Check back later or adjust your filters.
              </Typography>
            </Paper>
          )}
        </Container>
      </Box>

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
      
      {/* Job Response Dialog */}
      <Dialog
        open={isResponseDialogOpen}
        onClose={() => setIsResponseDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Respond to Job: {selectedJob?.JobTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText paragraph>
            Provide your proposal and any questions you have for the customer. Include your availability, expertise related to this job, and any other relevant information.
          </DialogContentText>
          <TextField
            autoFocus
            multiline
            rows={6}
            fullWidth
            variant="outlined"
            label="Your Response"
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setIsResponseDialogOpen(false)} 
            color="inherit"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleResponseSubmit} 
            color="primary"
            variant="contained"
            disabled={!responseMessage.trim() || isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Response"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AvailableJobs;
