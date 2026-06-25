import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

/**
 * StudentsPage
 * Lists and manages students for Head Coach and Assistant Coach
 */

export const StudentsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="page-container">
        <h1>Students</h1>
        <p>Students management page - content coming soon...</p>
      </div>
    </DashboardLayout>
  );
};

export default StudentsPage;
