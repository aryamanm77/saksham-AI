import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopNavbar from './components/TopNavbar';
import ReelFeed from './components/ReelFeed';
import { ExploreTab, CreateTab, CommunityTab, ProfileTab } from './components/Pages';
import Login from './components/Login';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeout = setTimeout(() => {
      if (loading) {
        setError("Firebase connection timed out. Check your Authorized Domains and Database Rules.");
        setLoading(false);
      }
    }, 5000);

    try {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        clearTimeout(timeout);
        setUser(currentUser);
        setLoading(false);
      }, (err) => {
        clearTimeout(timeout);
        console.error("Auth error:", err);
        setError(err.message);
        setLoading(false);
      });
      return () => {
        clearTimeout(timeout);
        unsubscribe();
      };
    } catch (err) {
      clearTimeout(timeout);
      console.error("Auth setup error:", err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  if (error) {
    return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', color: 'red', padding: '2rem', textAlign: 'center' }}>Auth Error: {error}</div>;
  }

  if (loading) {
    return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', color: 'white' }}>Loading App State...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <TopNavbar />
      <main className="main-layout">
        <Routes>
          <Route path="/" element={<ReelFeed user={user} />} />
          <Route path="/explore" element={<ExploreTab user={user} />} />
          <Route path="/create" element={<CreateTab user={user} />} />
          <Route path="/community" element={<CommunityTab user={user} />} />
          <Route path="/profile" element={<ProfileTab user={user} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
