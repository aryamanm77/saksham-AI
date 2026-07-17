import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import ReelFeed from './components/ReelFeed';
import { ExploreTab, PlaceholderTab } from './components/Pages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ReelFeed />} />
        <Route path="/explore" element={<ExploreTab />} />
        <Route path="/create" element={<PlaceholderTab title="Create" />} />
        <Route path="/community" element={<PlaceholderTab title="Community" />} />
        <Route path="/profile" element={<PlaceholderTab title="Profile" />} />
      </Routes>
      <BottomNav />
    </Router>
  );
}

export default App;
