import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp, MessageSquare, Repeat2, Send, Library, Plus } from 'lucide-react';
import './ReelCard.css';
import { db } from '../firebase';
import { ref, onValue, set, remove, update } from 'firebase/database';
import { Pencil, Volume2, VolumeX } from 'lucide-react';
import Comments from './Comments';

export default function ReelCard({ id, videoUrl, creator, title, description, tags, resourceLink, isPlaying, currentUser }) {
  const [activeReaction, setActiveReaction] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [totalReactions, setTotalReactions] = useState(0);
  const [showReactions, setShowReactions] = useState(false);
  
  const [reposted, setReposted] = useState(false);
  const [totalReposts, setTotalReposts] = useState(0);
  
  const [totalComments, setTotalComments] = useState(0);
  const [showComments, setShowComments] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ 
    title: title || '', 
    description: description || '', 
    videoUrl: videoUrl || '', 
    resourceLink: resourceLink || '' 
  });
  
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(err => {
          console.log("Video auto-play blocked or failed:", err);
        });
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await update(ref(db, `reels/${id}`), {
        title: editForm.title,
        description: editForm.description,
        videoUrl: editForm.videoUrl,
        resourceLink: editForm.resourceLink || null
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update post:", err);
      alert("Failed to update post.");
    }
  };

  const formattedTags = tags ? tags.map(t => `#${t}`).join(' ') : '';
  const isOwner = currentUser && currentUser.uid === creator?.uid;

  return (
    <div className="reel-card">
      <div className="video-container">
        <video 
          ref={videoRef}
          src={videoUrl}
          className="reel-video"
          loop
          muted={isMuted}
          playsInline
          onClick={() => setIsMuted(!isMuted)}
        />
        <button 
          className="mute-btn" 
          onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', padding: '10px', color: 'white', zIndex: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
      
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

        {isOwner && (
          <div className="action-button-wrapper">
            <button className="action-btn" onClick={() => setIsEditing(true)}>
              <div className="icon-circle" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <Pencil size={24} />
              </div>
              <span>Edit</span>
            </button>
          </div>
        )}
      </div>

      {isEditing && (
        <div className="comments-bottom-sheet" style={{ zIndex: 100, height: '70vh', background: 'var(--surface-color)', padding: '1rem' }}>
          <div className="comments-sheet-header">
            <h4>Edit Post</h4>
            <button onClick={() => setIsEditing(false)} className="close-btn">×</button>
          </div>
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Title</label>
              <input type="text" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="search-input" style={{ width: '100%', padding: '0.8rem', marginTop: '0.3rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} required />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Description</label>
              <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="search-input" style={{ width: '100%', padding: '0.8rem', marginTop: '0.3rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', minHeight: '60px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Video URL</label>
              <input type="url" value={editForm.videoUrl} onChange={e => setEditForm({...editForm, videoUrl: e.target.value})} className="search-input" style={{ width: '100%', padding: '0.8rem', marginTop: '0.3rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} required />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Resource URL</label>
              <input type="url" value={editForm.resourceLink} onChange={e => setEditForm({...editForm, resourceLink: e.target.value})} className="search-input" style={{ width: '100%', padding: '0.8rem', marginTop: '0.3rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
            </div>
            <button type="submit" className="pill-button primary" style={{ padding: '0.8rem' }}>Save Changes</button>
          </form>
        </div>
      )}

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
