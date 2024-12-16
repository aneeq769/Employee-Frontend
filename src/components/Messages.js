
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

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [recipient, setRecipient] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/messages/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!content || !recipient) return;

    try {
      await axios.post('http://localhost:8000/api/messages/', {
        content,
        recipient,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Clear input fields
      setContent('');
      setRecipient('');
      // Fetch updated messages
      fetchMessages();
      // Show success snackbar
      setSnackbarMessage('Message sent successfully!');
      setSnackbarType('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to send message', error);
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
          {messages.map(message => (
            <ListItem key={message.id} style={styles.listItem}>
              <ListItemText
                primary={
                  <div style={styles.messageWrapper}>
                    <Typography variant="subtitle1" style={styles.sender}>
                      {message.sender}
                    </Typography>
                    <div style={styles.messageBubble}>
                      {message.content}
                    </div>
                  </div>
                }
              />
            </ListItem>
          )).reverse()} {/* Reverse the order of messages to display the latest on top */}
        </List>
      </Paper>

      <form onSubmit={handleSendMessage} style={styles.form}>
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
    marginBottom: '5px',
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
    backgroundColor: '#e0f7fa',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
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

export default Messages;
