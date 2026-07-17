import React, { useState } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import './Login.css';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in database, if not, create initial profile
      const userRef = ref(db, 'users/' + user.uid);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        await set(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          handle: '@' + user.email.split('@')[0],
          bio: 'AI enthusiast learning and building.',
          xp: 0,
          followers: 0,
          following: 0,
          joinedAt: Date.now()
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel">
        <div className="login-header">
          <h1>Welcome to Saksham AI</h1>
          <p>Learn, Build, and Connect in the AI Era</p>
        </div>
        
        <div className="login-body">
          <button 
            className="google-btn" 
            onClick={handleGoogleLogin} 
            disabled={loading}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" />
            <span>{loading ? "Signing in..." : "Continue with Google"}</span>
          </button>
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </div>
  );
}
