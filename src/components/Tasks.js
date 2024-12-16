
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Snackbar,
  SnackbarContent,
  IconButton,
  Paper,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/tasks/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleToggleTaskStatus = async (task) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';

      await axios.patch(`http://localhost:8000/api/tasks/${task.id}/`, {
        status: newStatus,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(tasks.map(t => (t.id === task.id ? { ...t, status: newStatus } : t)));
      setSnackbarMessage(`Task status updated to ${newStatus}`);
      setSnackbarType('success');
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      setSnackbarMessage('Error updating task status');
      setSnackbarType('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth="md" style={styles.container}>
      <Typography variant="h4" align="center" gutterBottom style={styles.title}>
        Tasks
      </Typography>

      <List>
        {tasks.map(task => (
          <ListItem key={task.id} component={Paper} style={styles.listItem}>
            <ListItemText
              primary={<Typography variant="h6" style={styles.taskTitle}>{task.title}</Typography>}
              secondary={
                <Box>
                  <Typography variant="body2">{task.description}</Typography>
                  <Typography variant="body2" style={styles.taskStatus}>Status: {task.status}</Typography>
                  <Typography variant="body2">Priority: {task.priority}</Typography>
                  <Typography variant="body2">
                    Due Date: {new Date(task.due_date).toLocaleDateString()}
                  </Typography>
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <Button
                variant="contained"
                color={task.status === 'Completed' ? 'error' : 'success'}
                onClick={() => handleToggleTaskStatus(task)}
                style={styles.button}
              >
                Mark as {task.status === 'Completed' ? 'Not Completed' : 'Completed'}
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* Snackbar for Error or Success Messages */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <SnackbarContent
          style={snackbarType === 'error' ? styles.errorSnackbar : styles.successSnackbar}
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
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
  },
  title: {
    color: '#1976d2',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  listItem: {
    marginBottom: '15px',
    padding: '15px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
    },
  },
  taskTitle: {
    color: '#3f51b5',
    fontWeight: '500',
  },
  taskStatus: {
    fontWeight: 'bold',
    color: '#4caf50',
  },
  button: {
    marginLeft: '10px',
  },
  errorSnackbar: {
    backgroundColor: '#f44336',
  },
  successSnackbar: {
    backgroundColor: '#4caf50',
  },
};

export default Tasks;
