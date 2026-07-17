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

export function PlaceholderTab({ title }) {
  return (
    <div className="page-container center-content">
      <h1>{title}</h1>
      <p>Coming soon...</p>
    </div>
  );
}
