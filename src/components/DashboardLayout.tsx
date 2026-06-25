import React from 'react';
import TopNav from './TopNav';
import './DashboardLayout.css';

/**
 * DashboardLayout Component
 * Wraps all authenticated pages with TopNav and consistent padding/spacing
 * Provides consistent layout structure for all dashboard pages
 */

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className="dashboard-layout">
      <TopNav />
      <main className={`dashboard-content ${className}`}>{children}</main>
    </div>
  );
};

export default DashboardLayout;
