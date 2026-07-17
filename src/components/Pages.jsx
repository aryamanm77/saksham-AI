import React from 'react';
import { Search } from 'lucide-react';
import './Pages.css';

export function ExploreTab() {
  const categories = [
    'Engineering', 'Programming', 'AI', 'Data Science', 
    'Finance', 'Design', 'Interview Prep', 'Hackathons'
  ];

  return (
    <div className="page-container">
      <header className="page-header">
        <span className="small-caps">EXPLORE</span>
        <h1>Discover lessons, creators, and viral skill paths</h1>
      </header>
      
      <div className="search-bar glass-panel">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search AI, internships, hackathons..." className="search-input" />
      </div>

      <div className="categories-grid">
        {categories.map(cat => (
          <button key={cat} className="category-btn glass-panel">{cat}</button>
        ))}
      </div>

      <div className="roadmap-card glass-panel">
        <div className="roadmap-icon"></div>
        <div className="roadmap-info">
          <h3>Live roadmap: GenAI Builder</h3>
          <p>7 reels, 3 projects, 1 mentor review</p>
        </div>
      </div>
    </div>
  );
}

export function CreateTab() {
  return (
    <div className="page-container">
      <header className="page-header">
        <span className="small-caps">CREATE</span>
        <h1>Record or upload your AI lesson</h1>
      </header>
      
      <div className="create-tools">
        <button className="tool-btn glass-panel">
          <div className="tool-icon camera-icon">🎥</div>
          <h3>Record Video</h3>
          <p>Use AI filters and teleprompter</p>
        </button>
        <button className="tool-btn glass-panel">
          <div className="tool-icon upload-icon">📤</div>
          <h3>Upload File</h3>
          <p>MP4, MOV up to 10 mins</p>
        </button>
        <button className="tool-btn glass-panel generate-btn">
          <div className="tool-icon sparkle-icon">✨</div>
          <h3>AI Generate</h3>
          <p>Turn a script into a video</p>
        </button>
      </div>
    </div>
  );
}

export function CommunityTab() {
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

export function ProfileTab() {
  return (
    <div className="page-container">
      <div className="profile-header">
        <img 
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80" 
          alt="Profile Avatar" 
          className="profile-avatar-large" 
        />
        <div className="profile-info">
          <h2>Aryaman</h2>
          <p className="profile-handle">@aryamanm77</p>
          <div className="profile-stats">
            <div><strong>1,240</strong> XP</div>
            <div><strong>14</strong> following</div>
            <div><strong>8</strong> followers</div>
          </div>
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
