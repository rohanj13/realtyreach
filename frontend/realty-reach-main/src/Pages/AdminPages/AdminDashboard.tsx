import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Refresh,
} from '@mui/icons-material';
import { getAllCustomers, getAllJobs, getAllProfessionals, verifyProfessional, rejectProfessional } from '@/services/AdminService';
import { Job } from '@/Models/Job';
import { Professional } from '@/Models/Professional';
import { UserProfile } from '@/Models/User';
import AdminJobDetailsPanel from '@/Components/AdminJobDetailsPanel';
import ProfessionalDetailsPanel from '@/Components/ProfessionalDetailsPanel';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [customers, setCustomers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, string | null>>({});
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [jobsData, professionalsData, customersData] = await Promise.all([
        getAllJobs(),
        getAllProfessionals(),
        getAllCustomers(),
      ]);
      setJobs(jobsData);
      setProfessionals(professionalsData);
      setCustomers(customersData);
      console.log('Fetched customers:', customersData);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (userId: string) => {
    setActionLoading(prev => ({ ...prev, [userId]: 'verify' }));
    try {
      await verifyProfessional(userId);
      setProfessionals(prev =>
        prev.map(prof =>
          prof.id === userId ? { ...prof, verificationStatus: true } : prof
        )
      );
    } catch (err) {
      setError('Failed to verify professional.');
      console.error('Error verifying professional:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: null }));
    }
  };

  const handleReject = async (userId: string) => {
    setActionLoading(prev => ({ ...prev, [userId]: 'reject' }));
    try {
      await rejectProfessional(userId);
      setProfessionals(prev =>
        prev.map(prof =>
          prof.id === userId ? { ...prof, verificationStatus: false } : prof
        )
      );
      // Update selected professional if it's the one being rejected
      if (selectedProfessional?.id === userId) {
        setSelectedProfessional({ ...selectedProfessional, verificationStatus: false });
      }
    } catch (err) {
      setError('Failed to reject professional.');
      console.error('Error rejecting professional:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: null }));
    }
  };

  const handleVerifyInPanel = async (userId: string) => {
    await handleVerify(userId);
    // Update selected professional if it's the one being verified
    if (selectedProfessional?.id === userId) {
      setSelectedProfessional({ ...selectedProfessional, verificationStatus: true });
    }
  };

  const handleRejectInPanel = async (userId: string) => {
    await handleReject(userId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Admin Dashboard
        </Typography>
        <Tooltip title="Refresh data">
          <IconButton onClick={fetchData} color="primary">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={`Jobs (${jobs.length})`} />
          <Tab label={`Customers (${customers.length})`} />
          <Tab label={`Professionals (${professionals.length})`} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Job ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Budget Range</TableCell>
                    <TableCell>Region</TableCell>
                    <TableCell>Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow 
                      key={job.jobId} 
                      hover
                      onClick={() => setSelectedJob(job)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{job.jobId}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {job.jobTitle}
                        </Typography>
                      </TableCell>
                      <TableCell>{job.jobType}</TableCell>
                      <TableCell>
                        {formatCurrency(job.budgetMin)} -{' '}
                        {formatCurrency(job.budgetMax)}
                      </TableCell>
                      <TableCell>{job.regions?.join(', ') || 'N/A'}</TableCell>
                      <TableCell>{formatDate(job.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {activeTab === 1 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id} hover>
                      <TableCell>{customer.id}</TableCell>
                      <TableCell>
                        {customer.firstName} {customer.lastName}
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={customer.firstLogin ? 'New User' : 'Active'}
                          color={customer.firstLogin ? 'info' : 'success'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {activeTab === 2 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Professional ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>License</TableCell>
                    <TableCell>Verification Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {professionals.map((professional) => (
                    <TableRow 
                      key={professional.id} 
                      hover
                      onClick={(e) => {
                        // Don't open panel if clicking on action buttons
                        if ((e.target as HTMLElement).closest('button')) {
                          return;
                        }
                        setSelectedProfessional(professional);
                      }}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{professional.id}</TableCell>
                      <TableCell>
                        {professional.firstName} {professional.lastName}
                      </TableCell>
                      <TableCell>{professional.email}</TableCell>
                      <TableCell>{professional.companyName || 'N/A'}</TableCell>
                      <TableCell>{professional.licenseNumber || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={professional.verificationStatus ? 'Verified' : 'Unverified'}
                          color={professional.verificationStatus ? 'success' : 'default'}
                          size="small"
                          icon={professional.verificationStatus ? <CheckCircle /> : <Cancel />}
                        />
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {!professional.verificationStatus && (
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircle />}
                              onClick={() => handleVerify(professional.id)}
                              disabled={actionLoading[professional.id] === 'verify'}
                            >
                              {actionLoading[professional.id] === 'verify' ? (
                                <CircularProgress size={20} />
                              ) : (
                                'Verify'
                              )}
                            </Button>
                          )}
                          {professional.verificationStatus && (
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<Cancel />}
                              onClick={() => handleReject(professional.id)}
                              disabled={actionLoading[professional.id] === 'reject'}
                            >
                              {actionLoading[professional.id] === 'reject' ? (
                                <CircularProgress size={20} />
                              ) : (
                                'Reject'
                              )}
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>

      {/* Job Details Panel */}
      {selectedJob && (
        <AdminJobDetailsPanel
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}

      {/* Professional Details Panel */}
      {selectedProfessional && (
        <ProfessionalDetailsPanel
          professional={selectedProfessional}
          onClose={() => setSelectedProfessional(null)}
          onVerify={handleVerifyInPanel}
          onReject={handleRejectInPanel}
          actionLoading={actionLoading}
        />
      )}
    </Container>
  );
};

export default AdminDashboard;