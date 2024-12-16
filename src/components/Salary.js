
import React, { useEffect, useState } from 'react';
import api from '../api';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  SnackbarContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const response = await api.get('/salary/');
        setSalaries(response.data);
      } catch (error) {
        console.error('Error fetching salaries:', error);
        setSnackbarMessage('Error fetching salary details.');
        setSnackbarOpen(true);
      }
    };

    fetchSalaries();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg" style={styles.container}>
      <Typography variant="h4" align="center" gutterBottom>
        Salary Details
      </Typography>
      <TableContainer component={Paper} elevation={3} style={styles.tableContainer}>
        <Table>
          <TableHead style={styles.tableHeader}>
            <TableRow>
              <TableCell style={styles.tableCell}>Date</TableCell>
              <TableCell align="right" style={styles.tableCell}>Basic Salary</TableCell>
              <TableCell align="right" style={styles.tableCell}>Bonuses</TableCell>
              <TableCell align="right" style={styles.tableCell}>Deductions</TableCell>
              <TableCell align="right" style={styles.tableCell}>Net Salary</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salaries.length > 0 ? (
              salaries.map((salary) => (
                <TableRow key={salary.id}>
                  <TableCell style={styles.tableCell}>{salary.date}</TableCell>
                  <TableCell align="right" style={styles.tableCell}>{salary.basic_salary}</TableCell>
                  <TableCell align="right" style={styles.tableCell}>{salary.bonuses}</TableCell>
                  <TableCell align="right" style={styles.tableCell}>{salary.deductions}</TableCell>
                  <TableCell align="right" style={styles.tableCell}>
                    {salary.net_salary || 'Not assigned'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" style={styles.emptyMessage}>
                  No salary details available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <SnackbarContent
          style={styles.errorSnackbar}
          message={snackbarMessage}
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
    backgroundColor: '#e3f2fd',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
  },
  tableHeader: {
    backgroundColor: '#1976d2', // Primary color for the header
    color: '#ffffff',
  },
  tableCell: {
    fontWeight: 'bold',
    color: '#333',
    '&:hover': {
      backgroundColor: '#e1f5fe', // Light hover effect
    },
  },
  emptyMessage: {
    fontStyle: 'italic',
    color: '#888',
  },
  errorSnackbar: {
    backgroundColor: '#f44336',
  },
};

export default Salary;
