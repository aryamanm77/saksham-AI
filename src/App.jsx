import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import ReelFeed from './components/ReelFeed';
import { ExploreTab, CreateTab, CommunityTab, ProfileTab } from './components/Pages';
import Login from './components/Login';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', color: 'white' }}>Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ReelFeed user={user} />} />
        <Route path="/explore" element={<ExploreTab />} />
        <Route path="/create" element={<CreateTab user={user} />} />
        <Route path="/community" element={<CommunityTab user={user} />} />
        <Route path="/profile" element={<ProfileTab user={user} />} />
      </Routes>
      <BottomNav />
    </Router>
  );
}

export default App;
