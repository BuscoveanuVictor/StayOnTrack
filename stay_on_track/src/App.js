import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import BlockList from './pages/BlockList';
import TaskTracker from './pages/TaskTracker';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './pages/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/block-list" element={
          <ProtectedRoute><BlockList /></ProtectedRoute>
        } />
        <Route path="/task-list" element={
          <ProtectedRoute><TaskTracker /></ProtectedRoute>
        } />
        <Route path="/auth/page" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;