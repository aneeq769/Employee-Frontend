
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  Snackbar,
  SnackbarContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import api from '../api';

const AttendanceAdmin = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState('');

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      const response = await api.get('attendance/');
      setAttendanceRecords(response.data);
    } catch (err) {
      setError('Failed to fetch attendance records.');
      setSnackbarType('error');
      setSnackbarOpen(true);
    }
  };

  const updateAttendanceStatus = async (id, status) => {
    setError('');
    setSuccess('');
    try {
      await api.patch(`attendance/${id}/`, { status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSuccess('Attendance status updated successfully.');
      setSnackbarType('success');
      setSnackbarOpen(true);
      fetchAttendanceRecords(); // Refresh the list
    } catch (err) {
      setError('Failed to update attendance status.');
      setSnackbarType('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container style={styles.container}>
      <Typography variant="h4" align="center" gutterBottom style={styles.title}>
        All Employees Attendance
      </Typography>

      {/* Attendance Records */}
      <TableContainer component={Paper} style={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" style={styles.headerCell}>ID</TableCell>
              <TableCell align="center" style={styles.headerCell}>Employee Name</TableCell>
              <TableCell align="center" style={styles.headerCell}>Date</TableCell>
              <TableCell align="center" style={styles.headerCell}>Status</TableCell>
              <TableCell align="center" style={styles.headerCell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No attendance records found.
                </TableCell>
              </TableRow>
            ) : (
              attendanceRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell align="center">{record.id}</TableCell>
                  <TableCell align="center">{record.employee_name}</TableCell>
                  <TableCell align="center">{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <Select
                      value={record.status}
                      onChange={(e) => updateAttendanceStatus(record.id, e.target.value)}
                      style={styles.select}
                      displayEmpty
                    >
                      <MenuItem value="Present">Present</MenuItem>
                      <MenuItem value="Absent">Absent</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => updateAttendanceStatus(record.id, record.status)}
                      style={styles.button}
                    >
                      Update Status
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar for Error or Success Messages */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <SnackbarContent
          style={snackbarType === 'error' ? styles.errorSnackbar : styles.successSnackbar}
          message={error || success}
          action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Snackbar>
    </Container>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
  },
  title: {
    color: '#1976d2',
    marginBottom: '20px',
    textAlign: 'center',
  },
  tableContainer: {
    marginTop: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  headerCell: {
    backgroundColor: '#1976d2', // Header background color
    color: 'white', // Header text color
    fontWeight: 'bold', // Bold text
    fontSize: '1.1rem', // Larger font size
    textAlign: 'center', // Center text
  },
  select: {
    minWidth: '120px',
  },
  button: {
    backgroundColor: '#1976d2',
    color: 'white',
  },
  errorSnackbar: {
    backgroundColor: '#f44336',
  },
  successSnackbar: {
    backgroundColor: '#4caf50',
  },
};

export default AttendanceAdmin;
