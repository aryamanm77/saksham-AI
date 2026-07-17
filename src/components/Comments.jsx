import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, push, serverTimestamp } from 'firebase/database';
import { Send } from 'lucide-react';
import './Comments.css';

export default function Comments({ postId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!postId) return;
    const commentsRef = ref(db, `comments/${postId}`);
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const commentsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); // Newest first
        setComments(commentsList);
      } else {
        setComments([]);
      }
    });

    return () => unsubscribe();
  }, [postId]);

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!currentUser) return alert("Please log in to comment.");
    if (!newComment.trim()) return;

    const commentsRef = ref(db, `comments/${postId}`);
    push(commentsRef, {
      userId: currentUser.uid,
      userName: currentUser.displayName || "User",
      userAvatar: currentUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      text: newComment.trim(),
      createdAt: serverTimestamp()
    }).then(() => {
      setNewComment("");
    }).catch(err => {
      console.error("Error posting comment:", err);
      alert("Failed to post comment.");
    });
  };

  return (
    <div className="comments-section">
      <div className="comments-divider"></div>
      
      <form className="comment-input-area" onSubmit={handlePostComment}>
        <img 
          src={currentUser?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"} 
          alt="Current user" 
          className="comment-avatar"
        />
        <div className="comment-input-wrapper">
          <input 
            type="text" 
            placeholder="Add a comment..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit" disabled={!newComment.trim()} className="post-comment-btn">
            <Send size={16} />
          </button>
        </div>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to start the conversation!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <img src={comment.userAvatar} alt={comment.userName} className="comment-avatar" />
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-author">{comment.userName}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
