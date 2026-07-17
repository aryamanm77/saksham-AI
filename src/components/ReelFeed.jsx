import React, { useState, useEffect } from 'react';
import ReelCard from './ReelCard';
import './ReelFeed.css';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

export default function ReelFeed({ user }) {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reelsRef = ref(db, 'reels');
    const unsubscribe = onValue(reelsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const reelsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setReels(reelsArray.reverse());
      } else {
        setReels([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Database read error:", error);
      setReels([]); // Fallback to empty
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="feed-container">
      {/* Left Sidebar: Profile Widget */}
      <aside className="left-sidebar">
        <div className="profile-widget glass-panel">
          <div className="profile-widget-bg"></div>
          <img 
            src={user?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"} 
            alt="Profile" 
            className="profile-widget-avatar"
          />
          <h3>{user?.displayName || "Creator"}</h3>
          <p>AI Engineer & Creator</p>
          <div className="profile-widget-stats">
            <div>Profile viewers <span>1,024</span></div>
          </div>
          <div className="profile-widget-stats" style={{ borderTop: 'none', paddingTop: '0.5rem' }}>
            <div>Post impressions <span>54.1K</span></div>
          </div>
        </div>
      </aside>

      {/* Main Feed */}
      <main className="main-feed">
        {loading ? (
          <div className="loading-state">Loading posts...</div>
        ) : reels.length === 0 ? (
          <div className="empty-state">No posts yet. Be the first to share!</div>
        ) : (
          reels.map((reel, index) => (
            <ReelCard 
              key={reel.id}
              {...reel}
              isPlaying={false} 
            />
          ))
        )}
      </main>

      {/* Right Sidebar: Recommendations */}
      <aside className="right-sidebar">
        <div className="recommendations-widget glass-panel">
          <h3>Add to your feed</h3>
          <div className="recommendation-item">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop" alt="Sarah" />
            <div className="recommendation-info">
              <h4>Sarah Chen</h4>
              <p>LLM Researcher @ DeepMind</p>
            </div>
          </div>
          <div className="recommendation-item">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="David" />
            <div className="recommendation-info">
              <h4>David Park</h4>
              <p>Building Agents @ OpenAI</p>
            </div>
          </div>
          <button className="pill-button" style={{ width: '100%', marginTop: '0.5rem' }}>
            View all recommendations
          </button>
        </div>
      </aside>
    </div>
  );
}
