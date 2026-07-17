import React, { useState } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import './Login.css';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  React.useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      GoogleAuth.initialize();
    }
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      let user;
      if (Capacitor.isNativePlatform()) {
        const googleUser = await GoogleAuth.signIn();
        const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
        const result = await signInWithCredential(auth, credential);
        user = result.user;
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        user = result.user;
      }
      
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

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError('Please enter email and password');
    
    setLoading(true);
    setError('');
    try {
      let user;
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        user = result.user;
        
        // Create initial profile for new email user
        const userRef = ref(db, 'users/' + user.uid);
        await set(userRef, {
          uid: user.uid,
          displayName: email.split('@')[0],
          email: user.email,
          photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.uid,
          handle: '@' + email.split('@')[0],
          bio: 'AI enthusiast learning and building.',
          xp: 0,
          followers: 0,
          following: 0,
          joinedAt: Date.now()
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
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
          <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="search-input" 
              style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="search-input" 
              style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
            />
            <button type="submit" className="pill-button primary" disabled={loading} style={{ padding: '0.8rem', width: '100%' }}>
              {loading ? "Please wait..." : (isSignUp ? "Sign Up" : "Sign In")}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)', cursor: 'pointer' }} onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
            </p>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0', color: 'var(--text-secondary)' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            <span style={{ padding: '0 10px', fontSize: '0.8rem' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          </div>

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
