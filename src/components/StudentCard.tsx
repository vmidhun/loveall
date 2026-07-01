import React from 'react';
import type { Student } from '../types';
import './StudentCard.css';

/**
 * StudentCard Component
 * Displays a compact student card with avatar, name, batch, skill level, and progress bar
 * Shows "due for review" badge when student needs bi-monthly assessment
 */

interface StudentCardProps {
  student: Student;
  onClick?: () => void;
  isDueForReview?: boolean;
  daysOverdue?: number;
}

const getSkillLevelColor = (skillLevel: string): string => {
  switch (skillLevel) {
    case 'Beginner':
      return 'blue';
    case 'Intermediate':
      return 'orange';
    case 'Advanced':
      return 'purple';
    case 'Professional':
      return 'green';
    default:
      return 'blue';
  }
};

const getSkillLevelProgress = (skillLevel: string): number => {
  switch (skillLevel) {
    case 'Beginner':
      return 25;
    case 'Intermediate':
      return 50;
    case 'Advanced':
      return 75;
    case 'Professional':
      return 100;
    default:
      return 0;
  }
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const StudentCard: React.FC<StudentCardProps> = ({ 
  student, 
  onClick, 
  isDueForReview = false,
  daysOverdue = 0
}) => {
  const skillColor = getSkillLevelColor(student.skillLevel);
  const progressValue = getSkillLevelProgress(student.skillLevel);
  const initials = getInitials(student.fullName);

  const formatOverdueMessage = () => {
    if (daysOverdue >= 9999) {
      return 'Never assessed';
    }
    return `${daysOverdue} days overdue`;
  };

  return (
    <div className="student-card" onClick={onClick} role="button" tabIndex={0}>
      {/* Avatar */}
      <div className={`student-avatar student-avatar-${skillColor}`}>
        {student.profilePhoto ? (
          <img src={student.profilePhoto} alt={student.fullName} />
        ) : (
          <span className="avatar-initials">{initials}</span>
        )}
      </div>

      {/* Card Content */}
      <div className="student-card-content">
        {/* Name */}
        <h3 className="student-name">{student.fullName}</h3>

        {/* Batch Info */}
        {student.batchId && <p className="student-batch">Batch {student.batchId.split('-')[1]}</p>}

        {/* Skill Level Badge */}
        <div className={`skill-badge skill-badge-${skillColor}`}>{student.skillLevel}</div>

        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div
              className={`progress-bar-fill progress-bar-fill-${skillColor}`}
              style={{ width: `${progressValue}%` }}
            ></div>
          </div>
          <span className="progress-label">{progressValue}%</span>
        </div>

        {/* Due for Review Badge */}
        {isDueForReview && (
          <div className="due-for-review-badge" title={`Assessment overdue: ${formatOverdueMessage()}`}>
            <span className="due-icon">⚠️</span>
            <span className="due-text">{formatOverdueMessage()}</span>
          </div>
        )}
      </div>

      {/* BAID Indicator */}
      {student.baidNumber && <div className="baid-indicator" title="BAID Registered">✓</div>}
    </div>
  );
};

export default StudentCard;
