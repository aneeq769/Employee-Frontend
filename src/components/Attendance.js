
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Snackbar,
  SnackbarContent,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

// Custom Styles
const useStyles = {
  container: {
    padding: '20px',
    backgroundColor: '#f5f5f5', 
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
  },
  title: {
    color: '#1976d2', 
    marginBottom: '20px',
    textAlign: 'center', 
  },
  button: {
    backgroundColor: '#4caf50', 
    color: 'white',
    '&:hover': {
      backgroundColor: '#388e3c', 
    },
    width: '100%', 
    marginTop: '10px', 
  },
  attendanceList: {
    maxHeight: '400px',
    overflowY: 'auto',
    marginBottom: '20px',
    border: '1px solid #e0e0e0', 
    borderRadius: '4px', 
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  errorSnackbar: {
    backgroundColor: '#f44336', 
  },
  successSnackbar: {
    backgroundColor: '#4caf50', 
  },
};

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Present');
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/attendance/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setAttendanceRecords(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setMessage('Error fetching attendance records.');
      setSnackbarType('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/attendance/', {
        status,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setAttendanceRecords([...attendanceRecords, response.data]);
      setMessage('Attendance marked successfully!');
      setSnackbarType('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error marking attendance:', error);
      setMessage('Error marking attendance. You may have already marked your attendance for today.');
      setSnackbarType('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) return (
    <div style={useStyles.loading}>
      <CircularProgress />
    </div>
  );

  return (
    <Container style={useStyles.container}>
      <Typography variant="h4" style={useStyles.title}>
        Attendance Records
      </Typography>

      <Paper elevation={3} style={{ padding: '16px' }}>
        <List style={useStyles.attendanceList}>
          {attendanceRecords.map(record => (
            <ListItem key={record.id}>
              <ListItemText primary={`${record.date}: ${record.status}`} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Typography variant="h5" style={{ marginBottom: '10px', textAlign: 'center' }}>
        Mark Attendance for Today
      </Typography>
      <ToggleButtonGroup
        value={status}
        exclusive
        onChange={(e, newStatus) => {
          if (newStatus !== null) {
            setStatus(newStatus);
          }
        }}
        style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}
      >
        <ToggleButton value="Present" style={{ flexGrow: 1 }}>
          Present
        </ToggleButton>
        <ToggleButton value="Absent" style={{ flexGrow: 1 }}>
          Absent
        </ToggleButton>
      </ToggleButtonGroup>
      <Button variant="contained" style={useStyles.button} onClick={markAttendance}>
        Mark Attendance
      </Button>

      {/* Snackbar for Error or Success Messages */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <SnackbarContent
          style={snackbarType === 'error' ? useStyles.errorSnackbar : useStyles.successSnackbar}
          message={message}
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

export default Attendance;
