import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, PlusSquare, Users, User, Search } from 'lucide-react';
import './TopNavbar.css';

export default function TopNavbar() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <nav className="top-navbar">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <NavLink to="/" className="navbar-brand">
          <span className="brand-logo">SA</span>
          <span className="brand-name">Saksham AI</span>
        </NavLink>

        {/* Search */}
        <div className={`navbar-search ${searchFocused ? 'focused' : ''}`}>
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search posts, skills, or creators" 
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Home size={22} />
            <span>Feed</span>
          </NavLink>
          <NavLink to="/explore" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Compass size={22} />
            <span>Explore</span>
          </NavLink>
          <NavLink to="/community" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Users size={22} />
            <span>Community</span>
          </NavLink>
          <NavLink to="/create" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <PlusSquare size={22} />
            <span>Post</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <User size={22} />
            <span>Me</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
