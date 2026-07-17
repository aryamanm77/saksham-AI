import React, { useState, useEffect } from 'react';
import ReelCard from './ReelCard';
import './ReelFeed.css';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';
import AIMentor from './AIMentor';

export default function ReelFeed() {
  const [reels, setReels] = useState([]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
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

  const handleScroll = (e) => {
    const container = e.target;
    const scrollPosition = container.scrollTop;
    const windowHeight = window.innerHeight;
    const newIndex = Math.round(scrollPosition / windowHeight);
    
    if (newIndex !== currentReelIndex) {
      setCurrentReelIndex(newIndex);
    }
  };

  if (loading) {
    return <div className="feed-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Loading videos...</div>;
  }

  if (reels.length === 0) {
    return <div className="feed-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', padding: '2rem', textAlign: 'center' }}>No videos yet! Head to the Create tab to upload the first one.</div>;
  }

  return (
    <div className="reel-feed no-scrollbar" onScroll={handleScroll}>
      {reels.map((reel, index) => (
        <ReelCard 
          key={reel.id}
          {...reel}
          isPlaying={index === currentReelIndex}
        />
      ))}
      <AIMentor />
    </div>
  );
}
