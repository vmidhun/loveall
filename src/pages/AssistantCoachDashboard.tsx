import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

/**
 * AssistantCoachDashboard Page
 * Displays assistant coach dashboard scoped to assigned students
 */

export const AssistantCoachDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="page-container">
        <h1>My Students</h1>
        <p>Assistant Coach Dashboard - Dashboard content coming soon...</p>
      </div>
    </DashboardLayout>
  );
};

export default AssistantCoachDashboard;
