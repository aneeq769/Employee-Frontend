
import React, { useEffect, useState } from 'react';
import api from '../api';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Snackbar,
  SnackbarContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const SalaryAdmin = () => {
  const [employees, setEmployees] = useState([]);
  const [salaryData, setSalaryData] = useState({
    employee: '',
    basic_salary: '',
    bonuses: '',
    deductions: '',
    date: '',
  });
  const [salaryRecords, setSalaryRecords] = useState([]); // State to hold recent salary records
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get('/users/');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    const fetchSalaryRecords = async () => {
      try {
        const response = await api.get('/salary/');
        setSalaryRecords(response.data);
      } catch (error) {
        console.error('Error fetching salary records:', error);
      }
    };

    fetchEmployees();
    fetchSalaryRecords(); // Fetch salary records when the component mounts
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalaryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const calculateNetSalary = () => {
    const basicSalary = parseFloat(salaryData.basic_salary) || 0;
    const bonuses = parseFloat(salaryData.bonuses) || 0;
    const deductions = parseFloat(salaryData.deductions) || 0;
    return (basicSalary + bonuses - deductions).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const netSalary = calculateNetSalary();

    try {
      await api.post('/salary/', { ...salaryData, net_salary: netSalary });
      setSnackbarMessage('Salary assigned successfully!');
      setSnackbarType('success');
      setSnackbarOpen(true);

      // Fetch updated salary records
      const response = await api.get('/salary/');
      setSalaryRecords(response.data); // Update salary records

      // Reset form
      setSalaryData({ employee: '', basic_salary: '', bonuses: '', deductions: '', date: '' });
    } catch (error) {
      console.error('Error assigning salary:', error);
      setSnackbarMessage('Failed to assign salary. Please try again.');
      setSnackbarType('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="md" style={styles.container}>
      <Typography variant="h4" align="center" style={styles.title}>
        Assign Salary to Employees
      </Typography>
      <Paper style={styles.paper}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <Typography variant="h6">Salary Details</Typography>
          <div style={styles.formGroup}>
            <label>Select Employee:</label>
            <Select
              name="employee"
              value={salaryData.employee}
              onChange={handleChange}
              required
              variant="outlined"
              style={styles.select}
            >
              <MenuItem value=""><em>Select an employee</em></MenuItem>
              {employees.map((employee) => (
                <MenuItem key={employee.id} value={employee.id}>
                  {employee.username}
                </MenuItem>
              ))}
            </Select>
          </div>
          <TextField
            label="Basic Salary"
            type="number"
            name="basic_salary"
            value={salaryData.basic_salary}
            onChange={handleChange}
            required
            variant="outlined"
            style={styles.textField}
          />
          <TextField
            label="Bonuses"
            type="number"
            name="bonuses"
            value={salaryData.bonuses}
            onChange={handleChange}
            required
            variant="outlined"
            style={styles.textField}
          />
          <TextField
            label="Deductions"
            type="number"
            name="deductions"
            value={salaryData.deductions}
            onChange={handleChange}
            required
            variant="outlined"
            style={styles.textField}
          />
          <TextField
            label="Date"
            type="date"
            name="date"
            value={salaryData.date}
            onChange={handleChange}
            required
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            style={styles.textField}
          />
          <TextField
            label="Net Salary"
            value={calculateNetSalary()} // Display calculated net salary
            readOnly
            variant="outlined"
            style={styles.textField}
          />
          <Button type="submit" variant="contained" color="primary" style={styles.button}>
            Assign Salary
          </Button>
        </form>
      </Paper>

      <Typography variant="h5" align="center" style={styles.title}>
        Recently Assigned Salaries
      </Typography>
      <TableContainer component={Paper} style={styles.tableContainer}>
        <Table style={styles.table}>
          <TableHead>
            <TableRow style={styles.tableHeader}>
              <TableCell style={{ ...styles.tableCell, fontWeight: 'bold' }}>Employee</TableCell>
              <TableCell style={{ ...styles.tableCell, fontWeight: 'bold' }}>Date</TableCell>
              <TableCell style={{ ...styles.tableCell, fontWeight: 'bold' }}>Basic Salary</TableCell>
              <TableCell style={{ ...styles.tableCell, fontWeight: 'bold' }}>Bonuses</TableCell>
              <TableCell style={{ ...styles.tableCell, fontWeight: 'bold' }}>Deductions</TableCell>
              <TableCell style={{ ...styles.tableCell, fontWeight: 'bold' }}>Net Salary</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salaryRecords.map((record) => (
              <TableRow key={record.id} style={styles.tableRow}>
                <TableCell style={styles.tableCell}>{record.employee_name}</TableCell>
                <TableCell style={styles.tableCell}>{record.date}</TableCell>
                <TableCell style={styles.tableCell}>{record.basic_salary}</TableCell>
                <TableCell style={styles.tableCell}>{record.bonuses}</TableCell>
                <TableCell style={styles.tableCell}>{record.deductions}</TableCell>
                <TableCell style={styles.tableCell}>{record.net_salary}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <SnackbarContent
          style={{
            backgroundColor: snackbarType === 'success' ? '#4caf50' : '#f44336',
          }}
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
    marginTop: '20px',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', 
    padding: '20px', // Padding for better spacing
    borderRadius: '8px', // Rounded corners
  },
  title: {
    margin: '20px 0',
  },
  paper: {
    padding: '20px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  select: {
    marginTop: '10px',
  },
  textField: {
    marginBottom: '15px',
  },
  button: {
    alignSelf: 'flex-end',
  },
  tableContainer: {
    marginTop: '20px',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  table: {
    minWidth: 650,
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#1a73e8',
    color: '#ffffff',
  },
  tableCell: {
    padding: '12px 15px',
    border: '1px solid #ddd',
    textAlign: 'left',
  },
  tableRow: {
    '&:nth-of-type(even)': {
      backgroundColor: '#f2f2f2',
    },
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
};

export default SalaryAdmin;
