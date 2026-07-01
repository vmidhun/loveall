/**
 * Tests for CoachWorkload component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CoachWorkload from './CoachWorkload';
import type { CoachWorkload as CoachWorkloadType } from '../utils/activityUtils';

describe('CoachWorkload', () => {
  const mockWorkloads: CoachWorkloadType[] = [
    {
      coachId: 'coach-1',
      coachName: 'Coach John',
      studentCount: 12,
      isOverloaded: true,
      isBalanced: false,
      isUnderloaded: false,
    },
    {
      coachId: 'coach-2',
      coachName: 'Coach Sarah',
      studentCount: 7,
      isOverloaded: false,
      isBalanced: true,
      isUnderloaded: false,
    },
    {
      coachId: 'coach-3',
      coachName: 'Coach Mike',
      studentCount: 3,
      isOverloaded: false,
      isBalanced: false,
      isUnderloaded: true,
    },
  ];

  it('should render empty state when no workloads', () => {
    render(<CoachWorkload workloads={[]} />);
    expect(screen.getByText('Coach Workloads')).toBeInTheDocument();
    expect(screen.getByText(/no coach assignments found/i)).toBeInTheDocument();
  });

  it('should render coach names and student counts', () => {
    render(<CoachWorkload workloads={mockWorkloads} />);
    expect(screen.getByText('Coach John')).toBeInTheDocument();
    expect(screen.getByText('Coach Sarah')).toBeInTheDocument();
    expect(screen.getByText('Coach Mike')).toBeInTheDocument();
    expect(screen.getByText('12 students')).toBeInTheDocument();
    expect(screen.getByText('7 students')).toBeInTheDocument();
    expect(screen.getByText('3 students')).toBeInTheDocument();
  });

  it('should display "Overloaded" status for coaches with >10 students', () => {
    render(<CoachWorkload workloads={mockWorkloads} />);
    expect(screen.getByText('Overloaded')).toBeInTheDocument();
  });

  it('should display "Balanced" status for coaches with 5-10 students', () => {
    render(<CoachWorkload workloads={mockWorkloads} />);
    expect(screen.getByText('Balanced')).toBeInTheDocument();
  });

  it('should display "Light" status for coaches with <5 students', () => {
    render(<CoachWorkload workloads={mockWorkloads} />);
    expect(screen.getByText('Light')).toBeInTheDocument();
  });

  it('should display legend explaining status indicators', () => {
    render(<CoachWorkload workloads={mockWorkloads} />);
    expect(screen.getByText(/balanced \(5-10\)/i)).toBeInTheDocument();
    expect(screen.getByText(/light \(<5\)/i)).toBeInTheDocument();
    expect(screen.getByText(/overloaded \(>10\)/i)).toBeInTheDocument();
  });

  it('should render singular "student" for count of 1', () => {
    const singleStudentWorkload: CoachWorkloadType[] = [
      {
        coachId: 'coach-1',
        coachName: 'Coach Solo',
        studentCount: 1,
        isOverloaded: false,
        isBalanced: false,
        isUnderloaded: true,
      },
    ];
    render(<CoachWorkload workloads={singleStudentWorkload} />);
    expect(screen.getByText('1 student')).toBeInTheDocument();
  });

  it('should display "No assignments" for coaches with 0 students', () => {
    const noStudentsWorkload: CoachWorkloadType[] = [
      {
        coachId: 'coach-1',
        coachName: 'Coach Empty',
        studentCount: 0,
        isOverloaded: false,
        isBalanced: false,
        isUnderloaded: false,
      },
    ];
    render(<CoachWorkload workloads={noStudentsWorkload} />);
    expect(screen.getByText('No assignments')).toBeInTheDocument();
  });
});
