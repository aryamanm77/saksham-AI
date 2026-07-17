import React, { useState, useEffect, useRef } from 'react';
import ReelCard from './ReelCard';
import './ReelFeed.css';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

export default function ReelFeed({ user }) {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const containerRef = useRef(null);

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

  const handleScroll = (e) => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const index = Math.round(scrollTop / clientHeight);
    if (index !== currentReelIndex) {
      setCurrentReelIndex(index);
    }
  };

  return (
    <div className="feed-container" ref={containerRef} onScroll={handleScroll}>
      {loading ? (
        <div style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          Loading posts...
        </div>
      ) : reels.length === 0 ? (
        <div style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          No posts yet. Be the first to share!
        </div>
      ) : (
        reels.map((reel, index) => (
          <ReelCard 
            key={reel.id}
            {...reel}
            isPlaying={index === currentReelIndex} 
            currentUser={user}
          />
        ))
      )}
    </div>
  );
}
