import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import TeacherDashboard from './pages/teacher/Dashboard';
import AddStudent from './pages/teacher/AddStudent';
import AddTest from './pages/teacher/AddTest';
import EnterMarks from './pages/teacher/EnterMarks';
import StudentDashboard from './pages/student/Dashboard';

function PrivateRoute({ children, role }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/teacher" element={
          <PrivateRoute role="teacher"><TeacherDashboard /></PrivateRoute>
        } />
        <Route path="/teacher/add-student" element={
          <PrivateRoute role="teacher"><AddStudent /></PrivateRoute>
        } />
        <Route path="/teacher/add-test" element={
          <PrivateRoute role="teacher"><AddTest /></PrivateRoute>
        } />
        <Route path="/teacher/marks/:studentId" element={
          <PrivateRoute role="teacher"><EnterMarks /></PrivateRoute>
        } />
        <Route path="/student" element={
          <PrivateRoute role="student"><StudentDashboard /></PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
