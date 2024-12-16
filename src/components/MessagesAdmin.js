
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  SnackbarContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const MessagesAdmin = () => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [recipient, setRecipient] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('');
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token'); // Adjust if your token storage method is different

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/messages/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(response.data);
      } catch (error) {
        setError('Failed to fetch messages');
      }
    };

    fetchMessages();
  }, [token]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!content || !recipient) {
      setError('Both fields are required');
      return;
    }

    try {
      await axios.post(
        'http://localhost:8000/api/messages/',
        { content, recipient },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh messages
      const response = await axios.get('http://localhost:8000/api/messages/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(response.data);
      setContent('');
      setRecipient('');
      setError(null);
      setSnackbarMessage('Message sent successfully!');
      setSnackbarType('success');
      setSnackbarOpen(true);
    } catch (error) {
      setError('Failed to send message');
      setSnackbarMessage('Failed to send message.');
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
        Messages
      </Typography>

      <Paper style={styles.messagesContainer}>
        <List style={styles.messageList}>
          {messages.map((msg) => (
            <ListItem key={msg.id} style={styles.listItem}>
              <ListItemText
                primary={
                  <div style={styles.messageWrapper}>
                    <div style={{
                      ...styles.messageBubble,
                      alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                      backgroundColor: msg.sender === 'You' ? '#d1e7dd' : '#f1f1f1',
                    }}>
                      <Typography variant="subtitle1" style={styles.sender}>
                        {msg.sender === 'You' ? 'You' : msg.sender}
                      </Typography>
                      <Typography variant="body1">
                        {msg.content}
                      </Typography>
                    </div>
                  </div>
                }
              />
            </ListItem>
          )).reverse()} {/* Reverse the order of messages to display the latest on top */}
        </List>
      </Paper>

      <form onSubmit={sendMessage} style={styles.form}>
        <TextField
          label="Recipient"
          variant="outlined"
          fullWidth
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
          style={styles.textField}
        />
        <TextField
          label="Message"
          variant="outlined"
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={styles.textField}
        />
        <Button type="submit" variant="contained" color="primary" style={styles.button}>
          Send
        </Button>
      </form>

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
      {error && <Typography color="error">{error}</Typography>}
    </Container>
  );
};

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
  },
  title: {
    color: '#333',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  messagesContainer: {
    maxHeight: '400px',
    overflowY: 'auto',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  messageList: {
    padding: 0,
  },
  listItem: {
    padding: 0,
    marginBottom: '10px',
  },
  messageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '5px',
    alignItems: 'flex-start',
  },
  sender: {
    fontWeight: '600',
    color: '#1a73e8',
  },
  messageBubble: {
    padding: '10px 15px',
    borderRadius: '15px',
    maxWidth: '80%',
    margin: '5px 0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10px',
  },
  textField: {
    marginBottom: '10px',
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1a73e8',
    },
    '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1a73e8',
    },
  },
  button: {
    backgroundColor: '#1a73e8',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1a63d0',
    },
  },
  errorSnackbar: {
    backgroundColor: '#f44336',
  },
  successSnackbar: {
    backgroundColor: '#4caf50',
  },
};

export default MessagesAdmin;
