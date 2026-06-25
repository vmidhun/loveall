import React from 'react';
import { Link } from 'react-router-dom';
import './AccessDeniedPage.css';

/**
 * AccessDeniedPage
 * Displayed when user tries to access unauthorized content
 */

export const AccessDeniedPage: React.FC = () => {
  return (
    <div className="access-denied-page">
      <div className="access-denied-container">
        <div className="access-denied-icon">⛔</div>
        <h1>Access Denied</h1>
        <p>You do not have permission to access this page.</p>
        <Link to="/login" className="btn-back">
          Return to Login
        </Link>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
