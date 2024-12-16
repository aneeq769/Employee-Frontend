
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ReportIcon from '@mui/icons-material/Report';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TaskIcon from '@mui/icons-material/Task';
import MessageIcon from '@mui/icons-material/Message';
import PaymentsIcon from '@mui/icons-material/Payments';
import LogoutIcon from '@mui/icons-material/Logout';
import amperor from "./Images/amp.jpg"; 
import Complaints from "./Complaints";
import Attendance from './Attendance';
import Tasks from './Tasks';
import Messages from './Messages';
import Salary from './Salary';
import { Link, Outlet } from 'react-router-dom';

const drawerWidth = 240;

function EmployeeDashboard() {
  const [activeComponent, setActiveComponent] = React.useState('Complaints'); // Default component

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    window.location.href = '/'; // Redirect to login page
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'Complaints':
        return <Complaints />;
      case 'Attendance':
        return <Attendance />;
      case 'Tasks':
        return <Tasks />;
      case 'Messages':
        return <Messages />;
      case 'Salary':
        return <Salary />;
      default:
        return <Complaints />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" noWrap component="div" sx={{  fontWeight: 'bold', color: '#FAFAD2' }}
          >
            Employee Dashboard
          </Typography>
          <img
            src={amperor} 
            alt="Dashboard Image" 
            style={{ height: '55px', marginLeft: 'auto' }} 
          />
        </Toolbar>

      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            backgroundColor: '#f0f0f0', 
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {[
              { text: 'Complaints' , icon: <ReportIcon /> },
              { text: 'Attendance', icon: <PeopleAltIcon /> },
              { text: 'Tasks', icon: <TaskIcon /> },
              { text: 'Messages', icon: <MessageIcon /> },
              { text: 'Salary', icon: <PaymentsIcon /> }
            ].map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => setActiveComponent(item.text)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  
                  {/* <ListItemText primary={item.text} /> */}
                  <ListItemText primary={<Typography sx={{ fontWeight: 'bold' }}>{item.text}</Typography>} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider />
          <List>
            <ListItem key="Logout" disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon /> {/* Logout Icon */}
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        
        {renderActiveComponent()} {/* Render the selected component */}
        {/* Outlet can still be used if needed for nested routes */}
        <Outlet />
      </Box>
    </Box>
  );
}

export default EmployeeDashboard;
