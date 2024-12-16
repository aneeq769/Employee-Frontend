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
import ComplaintsAdmin from "./ComplaintsAdmin";
import AttendanceAdmin from './AttendanceAdmin';
import TasksAdmin from './TasksAdmin';
import MessagesAdmin from './MessagesAdmin';
import SalaryAdmin from './SalaryAdmin';
import { Link, Outlet } from 'react-router-dom';

const drawerWidth = 240;

function AdminDashboard() {
  const [activeComponent, setActiveComponent] = React.useState('ComplaintsAdmin'); // Default component

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    window.location.href = '/'; 
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'ComplaintsAdmin':
        return <ComplaintsAdmin />;
      case 'AttendanceAdmin':
        return <AttendanceAdmin />;
      case 'TasksAdmin':
        return <TasksAdmin />;
      case 'MessagesAdmin':
        return <MessagesAdmin />;
      case 'SalaryAdmin':
        return <SalaryAdmin />;
      default:
        return <ComplaintsAdmin />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" noWrap component="div" sx={{  fontWeight: 'bold', color: '#FAFAD2' }}
          >
            Admin Dashboard
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
            backgroundColor: '#f0f0f0 ', 
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {[
              { text: 'ComplaintsAdmin', icon: <ReportIcon /> },
              { text: 'AttendanceAdmin', icon: <PeopleAltIcon /> },
              { text: 'TasksAdmin', icon: <TaskIcon /> },
              { text: 'MessagesAdmin', icon: <MessageIcon /> },
              { text: 'SalaryAdmin', icon: <PaymentsIcon /> }
            ].map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => setActiveComponent(item.text)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  {/* <ListItemText primary={item.text} /> */}
                  <ListItemText primary={<Typography sx={{ fontWeight: 'bold'}}>{item.text}</Typography>} />
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

export default AdminDashboard;
