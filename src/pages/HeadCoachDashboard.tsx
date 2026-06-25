import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import StudentGrid from '../components/StudentGrid';
import { useAuth } from '../contexts/AuthContext';
import { calculateDashboardStats } from '../utils/dashboardUtils';
import STUDENTS_DATA from '../data/students.json';
import type { Student } from '../types';
import './HeadCoachDashboard.css';

/**
 * HeadCoachDashboard Page
 * Displays head coach dashboard with welcome message, stat cards, and student grid
 * Shows: total students, BAID-registered count, batch count, average progress
 */

// Map raw JSON data to proper Student type with parsed dates
const parseStudents = (data: unknown): Student[] => {
  const studentArray = data as Array<Record<string, unknown>>;
  return studentArray.map((s) => ({
    ...(s as unknown as Student),
    dateOfBirth: new Date(s.dateOfBirth as string),
    createdAt: new Date(s.createdAt as string),
    updatedAt: new Date(s.updatedAt as string),
  }));
};

export const HeadCoachDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Parse and memoize students data
  const students = useMemo(() => parseStudents(STUDENTS_DATA), []);

  // Calculate dashboard statistics
  const stats = useMemo(() => calculateDashboardStats(students), [students]);

  // Handle student card click
  const handleStudentClick = (studentId: string) => {
    navigate(`/student/${studentId}`);
  };

  return (
    <DashboardLayout>
      <div className="head-coach-dashboard">
        {/* Welcome Section */}
        <div className="dashboard-welcome">
          <h1 className="welcome-title">Welcome, {user?.name}! 👋</h1>
          <p className="welcome-subtitle">Here's an overview of your coaching operations</p>
        </div>

        {/* Stat Cards Grid */}
        <div className="stat-cards-grid">
          {/* Total Students */}
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            label="Active students"
            icon={<StudentIconSvg />}
            variant="blue"
          />

          {/* BAID Registered */}
          <StatCard
            title="BAID Registered"
            value={`${stats.baidRegistered}/${stats.totalStudents}`}
            label={`${stats.baidPercentage}% registered`}
            icon={<BaidIconSvg />}
            variant="green"
          />

          {/* Batch Count */}
          <StatCard
            title="Batches"
            value={stats.batchCount}
            label="Active batches"
            icon={<BatchIconSvg />}
            variant="orange"
          />

          {/* Average Progress */}
          <StatCard
            title="Avg Progress"
            value={stats.averageProgress}
            label={stats.averageProgressLabel.split('(')[1]?.slice(0, -1) || 'Level'}
            icon={<ProgressIconSvg />}
            variant="blue"
          />
        </div>

        {/* Student Grid Section */}
        <div className="dashboard-section">
          <h2 className="section-title">All Students</h2>
          <StudentGrid students={students} onStudentClick={handleStudentClick} />
        </div>
      </div>
    </DashboardLayout>
  );
};

// Icon SVG Components
const StudentIconSvg: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const BaidIconSvg: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
    <path d="M10 17l-4-4m4-4l4 4"></path>
    <path d="M10 9l4 4m-4 4l-4-4"></path>
  </svg>
);

const BatchIconSvg: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const ProgressIconSvg: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

export default HeadCoachDashboard;
