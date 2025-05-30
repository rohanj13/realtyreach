import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../../Context/useAuth';
import { getAllJobsForCustomer, deleteJob } from '../../services/JobService';
import { Job } from '../../Models/Job';

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
            <Typography variant="h6">{job.JobTitle}</Typography>
            <Chip 
              label={job.Status || 'Open'} 
              color={job.Status === 'Closed' ? 'default' : 'success'} 
              size="small" 
              sx={{ ml: 1 }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Job Type: {job.JobType}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2"><strong>Postcode:</strong> {job.Postcode}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2"><strong>Property Type:</strong> {job.PropertyType}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2"><strong>Purchase Type:</strong> {job.PurchaseType}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Budget:</strong> ${job.BudgetMin.toLocaleString()} - ${job.BudgetMax.toLocaleString()}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="body2">
              <strong>Journey Progress:</strong> {job.JourneyProgress}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2">Selected Professional Types:</Typography>
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {job.SelectedProfessionals.map((professional, index) => (
                <Chip key={index} label={professional} size="small" />
              ))}
            </Box>
          </Grid>
          
          {job.AdditionalDetails && (
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2">Additional Details:</Typography>
              <Typography variant="body2" paragraph sx={{ mt: 1 }}>
                {job.AdditionalDetails}
              </Typography>
            </Grid>
          )}
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2">Contact Information:</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Email:</strong> {job.ContactEmail}
            </Typography>
            <Typography variant="body2">
              <strong>Phone:</strong> {job.ContactPhone}
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
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const fetchJobs = async () => {
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
  
  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setViewDialogOpen(true);
  };
  
  const handleDeleteClick = (jobId: string) => {
    setJobToDelete(jobId);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteJob(jobToDelete);
      // Remove the deleted job from the state
      setJobs(jobs.filter(job => job.jobId !== jobToDelete));
      setDeleteDialogOpen(false);
      setJobToDelete(null);
    } catch (err) {
      console.error('Error deleting job:', err);
      // Show error message
    } finally {
      setIsDeleting(false);
    }
  };
  
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
                      <TableCell>Location</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created</TableCell>
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
                        .map((job) => (
                          <TableRow key={job.jobId} hover>
                            <TableCell>
                              {job.JobTitle}
                            </TableCell>
                            <TableCell>{job.JobType}</TableCell>
                            <TableCell>{job.Postcode}</TableCell>
                            <TableCell>
                              <Chip 
                                label={job.Status || 'Open'} 
                                color={getStatusColor(job.Status) as any}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {job.CreatedAt ? new Date(job.CreatedAt).toLocaleDateString() : 'N/A'}
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
                                title="Edit Job"
                                // onClick={() => handleEditJob(job.jobId)}
                                disabled
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                title="Delete Job"
                                onClick={() => handleDeleteClick(job.jobId)}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
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
      
      {/* View Job Dialog */}
      <JobViewDialog
        open={viewDialogOpen}
        job={selectedJob}
        onClose={() => setViewDialogOpen(false)}
      />
      
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
            onClick={handleDeleteConfirm} 
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
