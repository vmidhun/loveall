import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

/**
 * StudentDashboard Page
 * Displays student dashboard with personal stats and progress
 */

export const StudentDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="page-container">
        <h1>My Dashboard</h1>
        <p>Student Dashboard - Dashboard content coming soon...</p>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
