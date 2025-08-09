import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Index from './pages/Index';
import BlockList from './pages/BlockList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/block-list" element={<BlockList />} />
      </Routes>
    </Router>
  );
}

export default App;