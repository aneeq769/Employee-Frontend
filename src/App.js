// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';
import Complaints from './components/Complaints';
import Attendance from './components/Attendance';

import Tasks from './components/Tasks';
import Messages from './components/Messages';
import Salary from './components/Salary';
import ComplaintsAdmin from './components/ComplaintsAdmin';
import AttendanceAdmin from './components/AttendanceAdmin';

import TasksAdmin from './components/TasksAdmin';
import MessagesAdmin from './components/MessagesAdmin';
import SalaryAdmin from './components/SalaryAdmin';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/complaints" element={<Complaints />} />
                <Route path="/attendance" element={<Attendance />} />
                
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/salary" element={<Salary />} />

                <Route path="/complaintsAdmin" element={<ComplaintsAdmin />} />
                <Route path="/attendanceAdmin" element={<AttendanceAdmin />} />
                
                <Route path="/tasksAdmin" element={<TasksAdmin />} />
                <Route path="/messagesAdmin" element={<MessagesAdmin />} />
                <Route path="/salaryAdmin" element={<SalaryAdmin />} />
            </Routes>
        </Router>
    );
};

export default App;
