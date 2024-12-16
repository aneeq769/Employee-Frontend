
import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Alert,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  CircularProgress,
  Snackbar,
  IconButton,
  Tooltip,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import api from '../api';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
}));

const UpdateButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: '#0288d1',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#0277bd',
  },
}));

const StatusChip = styled(Chip)(({ status, theme }) => ({
  backgroundColor:
    status === 'Resolved'
      ? theme.palette.success.main
      : status === 'Pending'
      ? theme.palette.warning.main
      : theme.palette.error.main,
  color: '#ffffff',
  fontWeight: 600,
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
  color: '#333333',
  fontWeight: 700,
}));

const SubHeaderTypography = styled(Typography)(({ theme }) => ({
  color: '#555555',
  fontWeight: 600,
}));

const ComplaintsAdmin = () => {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Fetch all complaints on component mount
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await api.get('complaints/');
      setComplaints(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch complaints.');
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateComplaintStatus = async (id, status) => {
    setError('');
    setSuccess('');
    setUpdating(true);
    try {
      await api.patch(
        `complaints/${id}/`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSuccess('Complaint status updated successfully.');
      fetchComplaints(); // Refresh the complaints list
      // Show success snackbar
      setSnackbarMessage('Complaint status updated successfully.');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (err) {
      setError('Failed to update complaint status.');
      console.error('Error updating complaint status:', err);
      // Show error snackbar
      setSnackbarMessage('Failed to update complaint status.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 4 },
        backgroundColor: '#f0f2f5',
        minHeight: '100vh',
      }}
    >
      <HeaderTypography variant="h4" gutterBottom>
        All Employees Complaints
      </HeaderTypography>

      {/* Error or Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Complaints List */}
      <StyledPaper elevation={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <SubHeaderTypography variant="h6">All Complaints</SubHeaderTypography>
          <Tooltip title="Refresh Complaints">
            <Button
              variant="outlined"
              color="primary"
              onClick={fetchComplaints}
              startIcon={<RefreshIcon />}
              sx={{
                borderColor: '#0288d1',
                color: '#0288d1',
                '&:hover': {
                  borderColor: '#0277bd',
                  backgroundColor: '#e1f5fe',
                },
              }}
            >
              Refresh
            </Button>
          </Tooltip>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
            <CircularProgress />
          </Box>
        ) : complaints.length === 0 ? (
          <Typography>No complaints found.</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#0288d1' }}>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Employee</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Subject</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Created At</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {complaints.map((complaint) => (
                  <TableRow key={complaint.id} hover>
                    <TableCell>{complaint.id}</TableCell>
                    <TableCell>{complaint.employee.username}</TableCell>
                    <TableCell>{complaint.subject}</TableCell>
                    <TableCell>{complaint.description}</TableCell>
                    <TableCell>
                      <StatusChip label={complaint.status} status={complaint.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(complaint.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Grid container spacing={1}>
                        <Grid item>
                          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                            <InputLabel id={`status-select-label-${complaint.id}`}>Status</InputLabel>
                            <Select
                              labelId={`status-select-label-${complaint.id}`}
                              id={`status-select-${complaint.id}`}
                              value={complaint.status}
                              onChange={(e) => updateComplaintStatus(complaint.id, e.target.value)}
                              label="Status"
                            >
                              <MenuItem value="Pending">Pending</MenuItem>
                              <MenuItem value="Resolved">Resolved</MenuItem>
                              <MenuItem value="Dismissed">Dismissed</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item>
                          <Tooltip title="Mark as Resolved">
                            <UpdateButton
                              variant="contained"
                              size="small"
                              onClick={() => updateComplaintStatus(complaint.id, 'Resolved')}
                              disabled={complaint.status === 'Resolved' || updating}
                            >
                              Mark Resolved
                            </UpdateButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </StyledPaper>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleCloseSnackbar}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ComplaintsAdmin;
