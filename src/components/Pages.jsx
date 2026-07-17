import React, { useState, useRef, useEffect } from 'react';
import { db, auth } from '../firebase';
import { ref, push, get, set, onValue } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReelCard from './ReelCard';
import './Pages.css';

export function ExploreTab({ user }) {
  const categories = [
    'Engineering', 'Programming', 'AI', 'Data Science', 
    'Finance', 'Design', 'Interview Prep', 'Hackathons'
  ];

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSearchQuery(initialQuery);
    if (initialQuery) {
      setLoading(true);
      const reelsRef = ref(db, 'reels');
      get(reelsRef).then((snapshot) => {
        const data = snapshot.val();
        if (data) {
          const reelsArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          
          const lowerQuery = initialQuery.toLowerCase();
          const filtered = reelsArray.filter(r => 
            (r.title && r.title.toLowerCase().includes(lowerQuery)) ||
            (r.description && r.description.toLowerCase().includes(lowerQuery)) ||
            (r.tags && r.tags.some(t => t.toLowerCase().includes(lowerQuery))) ||
            (r.creator && r.creator.name && r.creator.name.toLowerCase().includes(lowerQuery))
          );
          setReels(filtered.reverse());
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setReels([]);
    }
  }, [initialQuery]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <span className="small-caps">EXPLORE</span>
        <h1>Discover lessons, creators, and viral skill paths</h1>
      </header>
      
      <div className="search-bar glass-panel">
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search AI, internships, hackathons..." 
          className="search-input" 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      {initialQuery ? (
        <div className="search-results">
          <h3 style={{ margin: '1rem 0' }}>Search Results for "{initialQuery}"</h3>
          {loading ? (
            <p>Searching...</p>
          ) : reels.length > 0 ? (
            reels.map(reel => (
              <ReelCard key={reel.id} {...reel} isPlaying={false} currentUser={user} />
            ))
          ) : (
            <p>No posts found matching your search.</p>
          )}
        </div>
      ) : (
        <>
          <div className="categories-grid">
            {categories.map(cat => (
              <button 
                key={cat} 
                className="category-btn glass-panel"
                onClick={() => navigate(`/explore?q=${encodeURIComponent(cat)}`)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="roadmap-card glass-panel">
            <div className="roadmap-icon"></div>
            <div className="roadmap-info">
              <h3>Live roadmap: GenAI Builder</h3>
              <p>7 reels, 3 projects, 1 mentor review</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function CreateTab({ user }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [resourceLink, setResourceLink] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      setMessage("Please select a video and enter a title.");
      return;
    }

    setIsUploading(true);
    setMessage("Uploading to Cloudinary...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      // 1. Upload to Cloudinary
      const res = await fetch("https://api.cloudinary.com/v1_1/ft9btave/video/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.secure_url) {
        setMessage("Saving to database...");
        
        // 2. Save metadata to Firebase Realtime Database
        const reelsRef = ref(db, 'reels');
        await push(reelsRef, {
          videoUrl: data.secure_url,
          title: title,
          description: description,
          resourceLink: resourceLink || null,
          creator: {
            uid: user?.uid || "anonymous",
            name: user?.displayName || "Anonymous",
            role: "Creator",
            avatar: user?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3"
          },
          tags: ["New"],
          createdAt: Date.now()
        });

        setMessage("Upload successful!");
        setFile(null);
        setTitle('');
        setDescription('');
        setResourceLink('');
      } else {
        setMessage("Failed to upload video.");
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <span className="small-caps">CREATE</span>
        <h1>Upload your AI lesson</h1>
      </header>
      
      {!file ? (
        <div className="create-tools">
          <input 
            type="file" 
            accept="video/mp4,video/x-m4v,video/*" 
            style={{ display: 'none' }} 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button className="tool-btn glass-panel" onClick={handleUploadClick}>
            <div className="tool-icon upload-icon">📤</div>
            <h3>Upload File</h3>
            <p>MP4, MOV up to 10 mins</p>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="glass-panel" style={{ padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
            <p style={{ margin: '0 0 1rem 0' }}><strong>Selected:</strong> {file.name}</p>
            <input 
              type="text" 
              placeholder="Title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="search-input"
              style={{ width: '100%', marginBottom: '1rem', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            />
            <textarea 
              placeholder="Description (optional)" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="search-input"
              style={{ width: '100%', marginBottom: '1rem', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', minHeight: '80px' }}
            />
            <input 
              type="url" 
              placeholder="Resource Link (e.g. GitHub repo, PDF) (optional)" 
              value={resourceLink}
              onChange={(e) => setResourceLink(e.target.value)}
              className="search-input"
              style={{ width: '100%', marginBottom: '1rem', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            />
            <button type="submit" disabled={isUploading} className="pill-button primary" style={{ width: '100%' }}>
              {isUploading ? "Uploading..." : "Publish Video"}
            </button>
            <button type="button" disabled={isUploading} onClick={() => setFile(null)} className="pill-button" style={{ width: '100%', marginTop: '0.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>
              Cancel
            </button>
            {message && <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--brand-green)' }}>{message}</p>}
          </div>
        </form>
      )}
    </div>
  );
}

export function CommunityTab({ user }) {
  const threads = [
    { id: 1, author: 'Alex Chen', topic: 'Help with PyTorch gradients', replies: 14, time: '2h ago' },
    { id: 2, author: 'Sarah Jenkins', topic: 'Best resources for LLM fine-tuning?', replies: 32, time: '5h ago' },
    { id: 3, author: 'David Kim', topic: 'Looking for hackathon teammates!', replies: 8, time: '1d ago' }
  ];

  return (
    <div className="page-container">
      <header className="page-header">
        <span className="small-caps">COMMUNITY</span>
        <h1>Join the conversation</h1>
      </header>

      <div className="threads-list">
        {threads.map(thread => (
          <div key={thread.id} className="thread-card glass-panel">
            <h4>{thread.topic}</h4>
            <div className="thread-meta">
              <span>By {thread.author}</span>
              <span>•</span>
              <span>{thread.replies} replies</span>
              <span>•</span>
              <span>{thread.time}</span>
            </div>
          </div>
        ))}
      </div>
      <button className="pill-button primary compose-btn">New Post</button>
    </div>
  );
}

// get and set are imported at the top

export function ProfileTab({ user }) {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', handle: '', bio: '' });

  useEffect(() => {
    if (user) {
      const userRef = ref(db, 'users/' + user.uid);
      get(userRef).then(snapshot => {
        if (snapshot.exists()) {
          setProfileData(snapshot.val());
          setEditForm({
            name: snapshot.val().displayName || '',
            handle: snapshot.val().handle || '',
            bio: snapshot.val().bio || ''
          });
        } else {
          // Fallback if they accidentally deleted their database node
          const fallbackData = {
            uid: user.uid,
            displayName: user.displayName || 'Anonymous',
            email: user.email,
            photoURL: user.photoURL,
            handle: '@' + (user.email ? user.email.split('@')[0] : 'user'),
            bio: 'New user.',
            xp: 0,
            followers: 0,
            following: 0
          };
          setProfileData(fallbackData);
          setEditForm({
            name: fallbackData.displayName,
            handle: fallbackData.handle,
            bio: fallbackData.bio
          });
        }
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (user && profileData) {
      const userRef = ref(db, 'users/' + user.uid);
      const updatedData = {
        ...profileData,
        displayName: editForm.name,
        handle: editForm.handle,
        bio: editForm.bio
      };
      await set(userRef, updatedData);
      setProfileData(updatedData);
      setIsEditing(false);
    }
  };

  if (!profileData) return <div className="page-container">Loading profile...</div>;

  return (
    <div className="page-container">
      <div className="profile-header">
        <img 
          src={profileData.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"} 
          alt="Profile Avatar" 
          className="profile-avatar-large" 
        />
        <div className="profile-info" style={{ flex: 1 }}>
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="search-input" style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '4px', border: 'none' }} placeholder="Name" />
              <input type="text" value={editForm.handle} onChange={e => setEditForm({...editForm, handle: e.target.value})} className="search-input" style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '4px', border: 'none' }} placeholder="Handle" />
              <input type="text" value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} className="search-input" style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '4px', border: 'none' }} placeholder="Bio" />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button onClick={handleSaveProfile} className="pill-button primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Save</button>
                <button onClick={() => setIsEditing(false)} className="pill-button" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2>{profileData.displayName}</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setIsEditing(true)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '99px', fontSize: '0.8rem', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => signOut(auth)} style={{ background: 'rgba(244, 67, 54, 0.2)', border: 'none', color: '#ff5252', padding: '0.3rem 0.8rem', borderRadius: '99px', fontSize: '0.8rem', cursor: 'pointer' }}>Logout</button>
                </div>
              </div>
              <p className="profile-handle">{profileData.handle}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 0.8rem 0' }}>{profileData.bio}</p>
              <div className="profile-stats">
                <div><strong>{profileData.xp}</strong> XP</div>
                <div><strong>{profileData.following}</strong> following</div>
                <div><strong>{profileData.followers}</strong> followers</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="badges-section">
        <h3>Badges</h3>
        <div className="badges-grid">
          <div className="badge glass-panel">🔥 7-Day Streak</div>
          <div className="badge glass-panel">🧠 ML Beginner</div>
          <div className="badge glass-panel">🌟 First Post</div>
        </div>
      </div>
      
      <div className="profile-tabs">
        <button className="active">Saved Reels</button>
        <button>My Courses</button>
      </div>

      <div className="saved-grid">
        <div className="saved-item glass-panel">Gradient Descent</div>
        <div className="saved-item glass-panel">React Hooks</div>
        <div className="saved-item glass-panel">Kubernetes 101</div>
        <div className="saved-item glass-panel">Docker Basics</div>
      </div>
    </div>
  );
}
