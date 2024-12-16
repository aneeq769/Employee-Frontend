
import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import api from '../api';


const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  backgroundColor: '#6A1B9A',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#4A148C',
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

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Fetch complaints on component mount
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const payload = { subject, description };
      await api.post('complaints/', payload);
      setSuccess('Complaint submitted successfully.');
      setSubject('');
      setDescription('');
      fetchComplaints(); // Refresh the list
      // Show success snackbar
      setSnackbarMessage('Complaint submitted successfully.');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (err) {
      setError('Failed to submit complaint.');
      console.error('Error submitting complaint:', err);
      // Show error snackbar
      setSnackbarMessage('Failed to submit complaint.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setSubmitting(false);
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
        Complaints
      </HeaderTypography>

      {/* Submit Complaint Form */}
      <StyledPaper elevation={3}>
        <SubHeaderTypography variant="h6" gutterBottom>
          Submit a Complaint
        </SubHeaderTypography>
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
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Subject"
                variant="outlined"
                fullWidth
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                InputProps={{
                  style: { backgroundColor: '#f9f9f9' },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                InputProps={{
                  style: { backgroundColor: '#f9f9f9' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Tooltip title="Submit your complaint">
                <SubmitButton
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  fullWidth
                >
                  {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Complaint'}
                </SubmitButton>
              </Tooltip>
            </Grid>
          </Grid>
        </form>
      </StyledPaper>

      {/* Complaints List */}
      <StyledPaper elevation={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <SubHeaderTypography variant="h6">Your Complaints</SubHeaderTypography>
          <Tooltip title="Refresh Complaints">
            <Button
              variant="outlined"
              color="primary"
              onClick={fetchComplaints}
              startIcon={<RefreshIcon />}
              sx={{
                borderColor: '#6A1B9A',
                color: '#6A1B9A',
                '&:hover': {
                  borderColor: '#4A148C',
                  backgroundColor: '#e1bee7',
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
                <TableRow sx={{ backgroundColor: '#6A1B9A' }}>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Subject</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {complaints.map((complaint) => (
                  <TableRow key={complaint.id} hover>
                    <TableCell>{complaint.id}</TableCell>
                    <TableCell>{complaint.subject}</TableCell>
                    <TableCell>{complaint.description}</TableCell>
                    <TableCell>
                      <StatusChip label={complaint.status} status={complaint.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(complaint.created_at).toLocaleString()}
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

export default Complaints;
