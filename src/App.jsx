import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import ReelFeed from './components/ReelFeed';
import { ExploreTab, CreateTab, CommunityTab, ProfileTab } from './components/Pages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ReelFeed />} />
        <Route path="/explore" element={<ExploreTab />} />
        <Route path="/create" element={<CreateTab />} />
        <Route path="/community" element={<CommunityTab />} />
        <Route path="/profile" element={<ProfileTab />} />
      </Routes>
      <BottomNav />
    </Router>
  );
}

export default App;
