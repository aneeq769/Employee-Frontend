
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  SnackbarContent,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const TasksAdmin = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assigned_to: '',
    status: 'Pending',
    priority: 'Medium',
    due_date: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch tasks from the API
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/tasks/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setSnackbarMessage('Error fetching tasks.');
      setSnackbarOpen(true);
    }
  };

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/users/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setSnackbarMessage('Error fetching users.');
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/tasks/', newTask, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setNewTask({
        title: '',
        description: '',
        assigned_to: '',
        status: 'Pending',
        priority: 'Medium',
        due_date: ''
      });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      setSnackbarMessage('Error creating task.');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#1976d2' }}>
        Admin Tasks
      </Typography>
      <Paper elevation={3} sx={{ padding: '20px', marginBottom: '20px', backgroundColor: '#e0f7fa' }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Task Title"
            name="title"
            value={newTask.title}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: '5px',
              '& .MuiInputBase-root': { bgcolor: '#ffffff' },
            }}
          />
          <TextField
            label="Task Description"
            name="description"
            value={newTask.description}
            onChange={handleInputChange}
            required
            fullWidth
            multiline
            rows={4}
            margin="normal"
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: '5px',
              '& .MuiInputBase-root': { bgcolor: '#ffffff' },
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="assigned-to-label">Assign To</InputLabel>
            <Select
              labelId="assigned-to-label"
              name="assigned_to"
              value={newTask.assigned_to}
              onChange={handleInputChange}
              required
              sx={{ bgcolor: '#ffffff', borderRadius: '5px' }}
            >
              <MenuItem value="" disabled>Select User</MenuItem>
              {users.map(user => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={newTask.status}
              onChange={handleInputChange}
              sx={{ bgcolor: '#ffffff', borderRadius: '5px', textAlign: 'left' }}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              name="priority"
              value={newTask.priority}
              onChange={handleInputChange}
              sx={{ bgcolor: '#ffffff', borderRadius: '5px', textAlign: 'left' }}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Due Date"
            type="date"
            name="due_date"
            value={newTask.due_date}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: '5px',
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: '20px', backgroundColor: '#00796b', '&:hover': { backgroundColor: '#004d40' } }}>
            Add Task
          </Button>
        </form>
      </Paper>

      <Typography variant="h6" gutterBottom sx={{ color: '#00796b' }}>
        Task List
      </Typography>
      <List>
        {tasks.map(task => (
          <ListItem key={task.id} divider>
            <ListItemText
              primary={<Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>{task.title}</Typography>}
              secondary={
                <Box>
                  <Typography>{task.description}</Typography>
                  <Typography color="#616161"><strong>Assigned To:</strong> {task.assigned_to_username}</Typography>
                  <Typography color="#616161"><strong>Status:</strong> {task.status}</Typography>
                  <Typography color="#616161"><strong>Priority:</strong> {task.priority}</Typography>
                  <Typography color="#616161"><strong>Due Date:</strong> {task.due_date}</Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <SnackbarContent
          style={{ backgroundColor: '#f44336' }}
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

export default TasksAdmin;
