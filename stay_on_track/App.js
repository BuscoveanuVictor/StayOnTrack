import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Index from './pages/Index';
import BlockList from './pages/BlockList';
import TaskTracker from './pages/TaskTracker';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/block-list" element={<BlockList />} />
        <Route path="/tasks" element={<TaskTracker />} />
        {/* <Route path="/habits" element={<HabitTracker />} />
        <Route path="/progress-manager" element={<ProgressManager />} /> */}
      </Routes>
    </Router>
  );
}

export default App;