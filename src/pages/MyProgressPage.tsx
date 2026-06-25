import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

/**
 * MyProgressPage
 * Displays student's own progress and assessments
 */

export const MyProgressPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="page-container">
        <h1>My Progress</h1>
        <p>My progress page - content coming soon...</p>
      </div>
    </DashboardLayout>
  );
};

export default MyProgressPage;
