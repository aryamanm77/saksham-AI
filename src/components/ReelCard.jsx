import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Repeat2, Send, Bookmark, Library } from 'lucide-react';
import './ReelCard.css';

export default function ReelCard({ videoUrl, creator, title, description, tags, resourceLink, isPlaying }) {
  const [activeReaction, setActiveReaction] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [saved, setSaved] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(err => console.log("Video auto-play blocked or failed:", err));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className="reel-card">
      <div className="video-container">
        <video 
          ref={videoRef}
          src={videoUrl}
          className="reel-video"
          loop
          muted
          playsInline
        />
        {!isPlaying && <div className="play-overlay">▶</div>}
      </div>

      <div className="auto-play-pill glass-panel">
        Auto playing • 1/4
      </div>

      <div className="reel-overlay">
        <div className="reel-info glass-panel">
          <div className="creator-row">
            <img src={creator.avatar} alt={creator.name} className="creator-avatar" />
            <div className="creator-details">
              <h4>{creator.name}</h4>
              <p>{creator.role}</p>
            </div>
            <button className="pill-button primary follow-btn">Follow</button>
          </div>
          
          <div className="tags-row">
            <span className="tag-pill brand-green">
              {tags.join(' • ')}
            </span>
          </div>

          <h2 className="reel-title">{title}</h2>
          <p className="reel-description">{description}</p>

          <div className="reel-stats-row">
            <span className="stat-pill glass-panel">00:58 video</span>
            <span className="stat-pill glass-panel">4 min practice</span>
            <span className="stat-pill glass-panel">Machine Learning</span>
          </div>
        </div>

        <div className="action-buttons">
          <div 
            className="reaction-container"
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setShowReactions(false)}
          >
            {showReactions && (
              <div className="reaction-popup glass-panel">
                <button onClick={() => { setActiveReaction('👍'); setShowReactions(false); }}>👍</button>
                <button onClick={() => { setActiveReaction('🎉'); setShowReactions(false); }}>🎉</button>
                <button onClick={() => { setActiveReaction('🤝'); setShowReactions(false); }}>🤝</button>
                <button onClick={() => { setActiveReaction('❤️'); setShowReactions(false); }}>❤️</button>
                <button onClick={() => { setActiveReaction('💡'); setShowReactions(false); }}>💡</button>
              </div>
            )}
            <button 
              className="action-btn" 
              onClick={() => setActiveReaction(activeReaction ? null : '👍')}
            >
              <div className={`icon-container glass-panel ${activeReaction ? 'active-reaction' : ''}`}>
                {activeReaction ? (
                  <span style={{ fontSize: '1.2rem' }}>{activeReaction}</span>
                ) : (
                  <Heart fill="none" size={22} />
                )}
              </div>
              <span>{activeReaction ? '28.1k' : '28k'}</span>
            </button>
          </div>
          
          <button className="action-btn">
            <div className="icon-container glass-panel">
              <MessageCircle size={22} />
            </div>
            <span>912</span>
          </button>
          <button className="action-btn" onClick={() => setReposted(!reposted)}>
            <div className={`icon-container glass-panel ${reposted ? 'active-repost' : ''}`}>
              <Repeat2 size={22} />
            </div>
            <span>{reposted ? 'Reposted' : 'Repost'}</span>
          </button>
          <button className="action-btn">
            <div className="icon-container glass-panel">
              <Send size={22} />
            </div>
            <span>Share</span>
          </button>
          <button className="action-btn" onClick={() => setSaved(!saved)}>
            <div className={`icon-container glass-panel ${saved ? 'active-star' : ''}`}>
              <Bookmark fill={saved ? 'currentColor' : 'none'} size={22} />
            </div>
            <span>Save</span>
          </button>
          
          {resourceLink && (
            <button className="action-btn resources-btn" onClick={() => window.open(resourceLink, '_blank')}>
              <div className="icon-container glass-panel brand-bg">
                <div className="stacked-books">📚</div>
              </div>
              <span>Resources</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
