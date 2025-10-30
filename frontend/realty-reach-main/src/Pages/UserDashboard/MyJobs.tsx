import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  IconButton,
  Toolbar,
  AppBar,
  useMediaQuery,
  useTheme,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  Menu as MenuIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import Sidebar from '../../SharedComponents/Sidebar';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/userContext';
import { getAllJobsForCustomer, deleteJob } from '../../services/JobService';
import { AustralianState, Job } from '../../Models/Job';
import EditJobForm from '../../Components/EditJobForm';

interface JobViewDialogProps {
  open: boolean;
  job: Job | null;
  onClose: () => void;
}

const JobViewDialog: React.FC<JobViewDialogProps> = ({ open, job, onClose }) => {
  if (!job) return null;
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Job Details
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">{job.jobTitle}</Typography>
            <Chip 
              label={job.status || 'Open'} 
              color={job.status === 'Closed' ? 'default' : 'success'} 
              size="small" 
              sx={{ ml: 1 }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Job Type: {job.jobType}
            </Typography>
          </Grid>
          
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2"><strong>Property Type:</strong> {job.propertyType}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2"><strong>Purchase Type:</strong> {job.purchaseType}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Budget:</strong> ${job.budgetMin.toLocaleString()} - ${job.budgetMax.toLocaleString()}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="body2">
              <strong>Journey Progress:</strong> {job.journeyProgress}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2">Selected Professional Types:</Typography>
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {job.selectedProfessionals.map((professional, index) => (
                <Chip key={index} label={professional} size="small" />
              ))}
            </Box>
          </Grid>
          
          {job.additionalDetails && (
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2">Additional Details:</Typography>
              <Typography variant="body2" paragraph sx={{ mt: 1 }}>
                {job.additionalDetails}
              </Typography>
            </Grid>
          )}
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2">Contact Information:</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Email:</strong> {job.contactEmail}
            </Typography>
            <Typography variant="body2">
              <strong>Phone:</strong> {job.contactPhone}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const MyJobs: React.FC = () => {
  const { user } = useContext(UserContext)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Remove job view dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const fetchJobs = async () => {
      console.log('Fetching jobs for user:', user);
      if (!user?.Id) return;
      
      try {
        setLoading(true);
        const fetchedJobs = await getAllJobsForCustomer(user.Id);
        setJobs(fetchedJobs);
        setError(null);
      } catch (err) {
        setError('Failed to load jobs. Please try again.');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [user]);
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const navigate = useNavigate();
  const handleViewJob = (job: Job) => {
    navigate(`/job/${job.jobId}/matches`);
  };
  
  const handleDeleteClick = (jobId: string) => {
    setJobToDelete(jobId);
    setDeleteDialogOpen(true);
  };

  //const stateNames = job.states.map((s: number) => AustralianState[s]).join(', ');
  
  // const handleDeleteConfirm = async () => {
  //   if (!jobToDelete) return;
    
  //   try {
  //     setIsDeleting(true);
  //     await deleteJob(jobToDelete);
  //     // Remove the deleted job from the state
  //     setJobs(jobs.filter(job => job.jobId !== jobToDelete));
  //     setDeleteDialogOpen(false);
  //     setJobToDelete(null);
  //   } catch (err) {
  //     console.error('Error deleting job:', err);
  //     // Show error message
  //   } finally {
  //     setIsDeleting(false);
  //   }
  // };
  
  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'Closed':
        return 'default';
      case 'InProgress':
        return 'info';
      case 'Open':
        return 'success';
      case 'Pending':
        return 'warning';
      default:
        return 'success';
    }
  };
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar - permanent on desktop, drawer on mobile */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        >
          <Sidebar variant="temporary" onClose={() => setIsSidebarOpen(false)} />
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
                onClick={() => setIsSidebarOpen(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Typography variant="h6" component="div">
              My Jobs
            </Typography>
          </Toolbar>
        </AppBar>
        
        {/* Jobs List */}
        <Box sx={{ p: 3 }}>
          {loading ? (
            <LinearProgress />
          ) : error ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="error">{error}</Typography>
              <Button 
                variant="outlined" 
                sx={{ mt: 2 }}
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </Paper>
          ) : (
            <Paper sx={{ width: '100%' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Job Title</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Region</TableCell>
                      <TableCell>State</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {jobs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography sx={{ py: 2 }}>
                            No jobs found. Create a new job to get started.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      jobs
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((job) => {
                          const stateNames = Array.isArray(job.states)
                            ? job.states.map((s: number) => AustralianState[s]).join(', ')
                            : 'N/A';

                          return (
                            <TableRow key={job.jobId} hover>
                              <TableCell>{job.jobTitle}</TableCell>
                              <TableCell>{job.jobType}</TableCell>
                              <TableCell>{job.regions || 'N/A'}</TableCell>
                              <TableCell sx={{ verticalAlign: 'middle' }}>
                                {stateNames}
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={job.status || 'Open'} 
                                  color={getStatusColor(job.status) as any}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell align="right">
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewJob(job)}
                                  title="View Details"
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditJob(job)}
                                  title="Edit Job"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  title="Delete Job"
                                  color="error"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={jobs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          )}
        </Box>
      </Box>
      
      {/* View Job Dialog removed, navigation now handled by handleViewJob */}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this job? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            //onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} /> : null}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyJobs;
