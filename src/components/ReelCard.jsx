import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp, MessageSquare, Repeat2, Send, Bookmark, Library, MoreHorizontal } from 'lucide-react';
import './ReelCard.css';
import { db } from '../firebase';
import { ref, onValue, set, remove } from 'firebase/database';
import Comments from './Comments';

export default function ReelCard({ id, videoUrl, creator, title, description, tags, resourceLink, isPlaying, currentUser }) {
  const [activeReaction, setActiveReaction] = useState(null);
  const [totalReactions, setTotalReactions] = useState(0);
  const [showReactions, setShowReactions] = useState(false);
  
  const [reposted, setReposted] = useState(false);
  const [totalReposts, setTotalReposts] = useState(0);
  
  const [totalComments, setTotalComments] = useState(0);
  const [showComments, setShowComments] = useState(false);
  
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
  useEffect(() => {
    if (!id) return;
    
    // Listen for Reactions (Likes)
    const reactionsRef = ref(db, `likes/${id}`);
    const unsubReactions = onValue(reactionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTotalReactions(Object.keys(data).length);
        if (currentUser && data[currentUser.uid]) {
          setActiveReaction(data[currentUser.uid]);
        } else {
          setActiveReaction(null);
        }
      } else {
        setTotalReactions(0);
        setActiveReaction(null);
      }
    });

    // Listen for Reposts
    const repostsRef = ref(db, `reposts/${id}`);
    const unsubReposts = onValue(repostsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTotalReposts(Object.keys(data).length);
        if (currentUser && data[currentUser.uid]) {
          setReposted(true);
        } else {
          setReposted(false);
        }
      } else {
        setTotalReposts(0);
        setReposted(false);
      }
    });
    
    // Listen for Comments count
    const commentsRef = ref(db, `comments/${id}`);
    const unsubComments = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTotalComments(Object.keys(data).length);
      } else {
        setTotalComments(0);
      }
    });

    return () => {
      unsubReactions();
      unsubReposts();
      unsubComments();
    };
  }, [id, currentUser]);

  const handleReaction = (reactionType) => {
    if (!currentUser) return alert("Please log in to react!");
    if (activeReaction === reactionType || (!reactionType && activeReaction)) {
      // Remove reaction
      remove(ref(db, `likes/${id}/${currentUser.uid}`));
    } else {
      // Add/Update reaction
      set(ref(db, `likes/${id}/${currentUser.uid}`), reactionType || '👍');
    }
    setShowReactions(false);
  };

  const handleRepost = () => {
    if (!currentUser) return alert("Please log in to repost!");
    if (reposted) {
      remove(ref(db, `reposts/${id}/${currentUser.uid}`));
    } else {
      set(ref(db, `reposts/${id}/${currentUser.uid}`), true);
    }
  };

  const handleShare = async () => {
    const url = window.location.href; // In production this could link to specific post ?id=...
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };
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
        <span>{totalReactions > 0 ? `${totalReactions} reactions` : 'Be the first to react'}</span>
        <span>{totalComments} comments • {totalReposts} reposts</span>
      </div>

      <div className="post-actions">
        <div 
          className="reaction-container"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          {showReactions && (
            <div className="reaction-popup">
              <button onClick={() => handleReaction('👍')}>👍</button>
              <button onClick={() => handleReaction('🎉')}>🎉</button>
              <button onClick={() => handleReaction('🤝')}>🤝</button>
              <button onClick={() => handleReaction('❤️')}>❤️</button>
              <button onClick={() => handleReaction('💡')}>💡</button>
            </div>
          )}
          <button 
            className={`action-btn ${activeReaction ? 'active-reaction' : ''}`}
            onClick={() => handleReaction(activeReaction ? null : '👍')}
          >
            {activeReaction ? (
              <span style={{ fontSize: '1.2rem' }}>{activeReaction}</span>
            ) : (
              <ThumbsUp size={20} />
            )}
            <span>Like</span>
          </button>
        </div>
        
        <button className="action-btn" onClick={() => setShowComments(!showComments)}>
          <MessageSquare size={20} />
          <span>Comment</span>
        </button>
        
        <button className={`action-btn ${reposted ? 'active-reaction' : ''}`} onClick={handleRepost}>
          <Repeat2 size={20} />
          <span>Repost</span>
        </button>
        
        <button className="action-btn" onClick={handleShare}>
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

      {showComments && (
        <Comments postId={id} currentUser={currentUser} />
      )}
    </div>
  );
}
