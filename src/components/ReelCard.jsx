import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp, MessageSquare, Repeat2, Send, Bookmark, Library, MoreHorizontal } from 'lucide-react';
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

  // Format tags safely
  const formattedTags = tags ? tags.join(' • ') : '';

  return (
    <div className="reel-card">
      <div className="post-header">
        <div className="creator-info">
          <img src={creator.avatar} alt={creator.name} className="creator-avatar" />
          <div className="creator-details">
            <h4>{creator.name}</h4>
            <p>{creator.role} • 2h</p>
          </div>
        </div>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="post-body">
        <h3 className="post-title">{title}</h3>
        {description && <p className="post-description">{description}</p>}
        {formattedTags && (
          <div className="tags-row">
            <span className="tag-pill">{formattedTags}</span>
          </div>
        )}
      </div>

      <div className="video-container">
        <video 
          ref={videoRef}
          src={videoUrl}
          className="reel-video"
          loop
          muted
          playsInline
          controls={!isPlaying}
        />
        {!isPlaying && <div className="play-overlay">▶</div>}
      </div>

      <div className="post-stats">
        <span>{activeReaction ? '28,142' : '28,141'} reactions</span>
        <span>912 comments • {reposted ? '143' : '142'} reposts</span>
      </div>

      <div className="post-actions">
        <div 
          className="reaction-container"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          {showReactions && (
            <div className="reaction-popup">
              <button onClick={() => { setActiveReaction('👍'); setShowReactions(false); }}>👍</button>
              <button onClick={() => { setActiveReaction('🎉'); setShowReactions(false); }}>🎉</button>
              <button onClick={() => { setActiveReaction('🤝'); setShowReactions(false); }}>🤝</button>
              <button onClick={() => { setActiveReaction('❤️'); setShowReactions(false); }}>❤️</button>
              <button onClick={() => { setActiveReaction('💡'); setShowReactions(false); }}>💡</button>
            </div>
          )}
          <button 
            className={`action-btn ${activeReaction ? 'active-reaction' : ''}`}
            onClick={() => setActiveReaction(activeReaction ? null : '👍')}
          >
            {activeReaction ? (
              <span style={{ fontSize: '1.2rem' }}>{activeReaction}</span>
            ) : (
              <ThumbsUp size={20} />
            )}
            <span>Like</span>
          </button>
        </div>
        
        <button className="action-btn">
          <MessageSquare size={20} />
          <span>Comment</span>
        </button>
        
        <button className={`action-btn ${reposted ? 'active-reaction' : ''}`} onClick={() => setReposted(!reposted)}>
          <Repeat2 size={20} />
          <span>Repost</span>
        </button>
        
        <button className="action-btn">
          <Send size={20} />
          <span>Send</span>
        </button>

        {resourceLink && (
          <button className="action-btn resources-btn" onClick={() => window.open(resourceLink, '_blank')}>
            <Library size={20} />
            <span>Resources</span>
          </button>
        )}
      </div>
    </div>
  );
}
