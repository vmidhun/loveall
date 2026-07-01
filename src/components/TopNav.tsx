import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types';
import './TopNav.css';

/**
 * TopNav Component
 * Displays application header with role-aware navigation, user profile, and sign-out
 */

interface NavLink {
  label: string;
  path: string;
  roles: UserRole[];
}

const NAV_LINKS: NavLink[] = [
  { label: 'Dashboard', path: '/dashboard', roles: ['HEAD_COACH', 'ASSISTANT_COACH'] },
  { label: 'Students', path: '/students', roles: ['HEAD_COACH', 'ASSISTANT_COACH'] },
  { label: 'Fees', path: '/fees', roles: ['HEAD_COACH', 'ASSISTANT_COACH'] },
  { label: 'Coaches', path: '/coaches', roles: ['HEAD_COACH'] },
  { label: 'Curriculum', path: '/curriculum', roles: ['HEAD_COACH', 'ASSISTANT_COACH'] },
  // Student role
  { label: 'Dashboard', path: '/student-dashboard', roles: ['STUDENT'] },
  { label: 'My Progress', path: '/my-progress', roles: ['STUDENT'] },
  { label: 'My Fees', path: '/my-fees', roles: ['STUDENT'] },
];

export const TopNav: React.FC = () => {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filter nav links for current user role
  const visibleLinks = NAV_LINKS.filter((link) => link.roles.includes(role || ('STUDENT' as UserRole)));

  // Handle sign out
  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  // Generate user initials for avatar
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = user?.name ? getInitials(user.name) : 'U';

  return (
    <nav className="topnav">
      <div className="topnav-container">
        {/* Logo / Brand */}
        <Link to="/" className="topnav-logo">
          <span className="logo-text">LoveAll</span>
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="topnav-links-desktop">
          {visibleLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`topnav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side: User Profile & Sign Out */}
        <div className="topnav-right">
          {/* User Info */}
          <div className="user-info">
            <div className="user-avatar">{initials}</div>
            <div className="user-details">
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-role">{role?.replace('_', ' ') || 'Guest'}</div>
            </div>
          </div>

          {/* Sign Out Button */}
          <button className="btn-signout" onClick={handleSignOut} title="Sign out">
            <svg
              className="icon-signout"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"></path>
              <polyline points="10 12 14 12"></polyline>
              <polyline points="12 10 14 12 12 14"></polyline>
            </svg>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="btn-mobile-menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            title="Toggle menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation Links - Mobile */}
      {isMobileMenuOpen && (
        <div className="topnav-links-mobile">
          {visibleLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`topnav-link-mobile ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button className="topnav-link-mobile signout-mobile" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default TopNav;
