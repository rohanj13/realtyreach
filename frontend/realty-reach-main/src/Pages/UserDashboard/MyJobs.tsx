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
  Grid,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import Sidebar from '../../SharedComponents/Sidebar';
import Logo from '../../SharedComponents/Logo';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/userContext';
import { getAllJobsForCustomer, deleteJob } from '../../services/JobService';
import { AustralianState, JobDto } from '../../Models/Job';
import EditJobForm from '../../Components/EditJobForm';
import { PageContainer, PageHeader, LoadingSpinner, ErrorAlert } from '../../SharedComponents/UIComponents';

const MyJobs: React.FC = () => {
  const { user } = useContext(UserContext)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [jobs, setJobs] = useState<JobDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    const fetchJobs = async () => {
      console.log('Fetching jobs for user:', user);
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const fetchedJobs = await getAllJobsForCustomer(user.id);
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
  const handleViewJob = (jobId: number) => {
    navigate(`/job/${jobId}/matches`);
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
            
            <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
              <Logo variant="compact" size="small" color="inherit" />
            </Box>
            
            <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexGrow: 1 }}>
              <Logo variant="icon-only" size="small" color="inherit" />
            </Box>
          </Toolbar>
        </AppBar>
        
        {/* Jobs List */}
        <PageContainer>
          {error && (
            <ErrorAlert 
              message={error}
              onRetry={() => window.location.reload()}
            />
          )}

          {loading ? (
            <LoadingSpinner message="Loading your jobs..." />
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
                                  onClick={() => handleViewJob(job.jobId)}
                                  title="View Details"
                                >
                                  <VisibilityIcon fontSize="small" />
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
        </PageContainer>
      </Box>
    </Box>
  );
};

export default MyJobs;
