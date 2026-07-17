import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp, MessageSquare, Repeat2, Send, Library, Plus } from 'lucide-react';
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
      remove(ref(db, `likes/${id}/${currentUser.uid}`));
    } else {
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
    const url = window.location.href; 
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

  const formattedTags = tags ? tags.map(t => `#${t}`).join(' ') : '';

  return (
    <div className="reel-card">
      <video 
        ref={videoRef}
        src={videoUrl}
        className="reel-video"
        loop
        muted
        playsInline
      />
      
      {/* Right side floating actions */}
      <div className="floating-actions">
        <div className="action-creator">
          <img src={creator.avatar} alt={creator.name} />
          <button className="follow-btn"><Plus size={14} /></button>
        </div>

        <div className="action-button-wrapper" onMouseEnter={() => setShowReactions(true)} onMouseLeave={() => setShowReactions(false)}>
          {showReactions && (
            <div className="reaction-popup-vertical">
              <button onClick={() => handleReaction('👍')}>👍</button>
              <button onClick={() => handleReaction('🎉')}>🎉</button>
              <button onClick={() => handleReaction('🤝')}>🤝</button>
              <button onClick={() => handleReaction('❤️')}>❤️</button>
              <button onClick={() => handleReaction('💡')}>💡</button>
            </div>
          )}
          <button className={`action-btn ${activeReaction ? 'active' : ''}`} onClick={() => handleReaction(activeReaction ? null : '👍')}>
            <div className="icon-circle">
              {activeReaction ? <span>{activeReaction}</span> : <ThumbsUp size={24} />}
            </div>
            <span>{totalReactions}</span>
          </button>
        </div>

        <div className="action-button-wrapper">
          <button className="action-btn" onClick={() => setShowComments(true)}>
            <div className="icon-circle">
              <MessageSquare size={24} />
            </div>
            <span>{totalComments}</span>
          </button>
        </div>

        <div className="action-button-wrapper">
          <button className={`action-btn ${reposted ? 'active' : ''}`} onClick={handleRepost}>
            <div className="icon-circle">
              <Repeat2 size={24} />
            </div>
            <span>{totalReposts}</span>
          </button>
        </div>

        <div className="action-button-wrapper">
          <button className="action-btn" onClick={handleShare}>
            <div className="icon-circle">
              <Send size={24} />
            </div>
            <span>Share</span>
          </button>
        </div>

        {resourceLink && (
          <div className="action-button-wrapper">
            <button className="action-btn" onClick={() => window.open(resourceLink, '_blank')}>
              <div className="icon-circle resources-icon">
                <Library size={24} />
              </div>
              <span>Resource</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom overlay info */}
      <div className="reel-info">
        <h3>{creator.name}</h3>
        <p className="reel-title">{title}</p>
        {description && <p className="reel-description">{description}</p>}
        {formattedTags && <p className="reel-tags">{formattedTags}</p>}
      </div>

      {showComments && (
        <div className="comments-bottom-sheet">
          <div className="comments-sheet-header">
            <h4>{totalComments} Comments</h4>
            <button onClick={() => setShowComments(false)} className="close-btn">×</button>
          </div>
          <Comments postId={id} currentUser={currentUser} />
        </div>
      )}
    </div>
  );
}
