import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CoachListTable from './CoachListTable';
import type { User, Student, Batch } from '../types';

describe('CoachListTable', () => {
  const mockCoaches: User[] = [
    {
      id: 'coach-1',
      username: 'assistant1',
      role: 'ASSISTANT_COACH',
      name: 'Priya Sharma',
      email: 'priya@test.com',
      specialization: 'Doubles Training',
      createdAt: new Date('2026-01-01'),
      lastActive: new Date('2026-01-15'),
    },
    {
      id: 'coach-2',
      username: 'assistant2',
      role: 'ASSISTANT_COACH',
      name: 'Vikram Singh',
      email: 'vikram@test.com',
      specialization: 'Footwork',
      createdAt: new Date('2026-01-01'),
      lastActive: new Date('2026-01-10'),
    },
    {
      id: 'head-1',
      username: 'head',
      role: 'HEAD_COACH',
      name: 'Head Coach',
      email: 'head@test.com',
      createdAt: new Date('2026-01-01'),
      lastActive: new Date('2026-01-15'),
    },
  ];

  const mockStudents: Student[] = [
    {
      id: 'student-1',
      fullName: 'Student One',
      dateOfBirth: new Date('2010-01-01'),
      age: 16,
      gender: 'Male',
      contactPhone: '1234567890',
      assignedCoachId: 'coach-1',
      batchId: 'batch-1',
      strengths: [],
      weaknesses: [],
      skillLevel: 'Intermediate',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'student-2',
      fullName: 'Student Two',
      dateOfBirth: new Date('2010-01-01'),
      age: 16,
      gender: 'Female',
      contactPhone: '1234567891',
      assignedCoachId: 'coach-1',
      batchId: 'batch-1',
      strengths: [],
      weaknesses: [],
      skillLevel: 'Beginner',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'student-3',
      fullName: 'Student Three',
      dateOfBirth: new Date('2010-01-01'),
      age: 16,
      gender: 'Male',
      contactPhone: '1234567892',
      assignedCoachId: 'coach-2',
      batchId: 'batch-2',
      strengths: [],
      weaknesses: [],
      skillLevel: 'Advanced',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockBatches: Batch[] = [
    {
      id: 'batch-1',
      name: 'Morning Batch',
      schedule: 'Mon/Wed/Fri 6-7 AM',
      assignedCoachId: 'coach-1',
      studentCount: 2,
      createdAt: new Date(),
    },
    {
      id: 'batch-2',
      name: 'Evening Batch',
      schedule: 'Tue/Thu 5-6 PM',
      assignedCoachId: 'coach-2',
      studentCount: 1,
      createdAt: new Date(),
    },
  ];

  it('should render coach list table with headers', () => {
    render(<CoachListTable coaches={mockCoaches} students={mockStudents} batches={mockBatches} />);

    expect(screen.getByText('Coach Name')).toBeInTheDocument();
    expect(screen.getByText('Specialization')).toBeInTheDocument();
    expect(screen.getByText('Assigned Batches')).toBeInTheDocument();
    expect(screen.getByText('Assigned Students')).toBeInTheDocument();
    expect(screen.getByText('Last Active')).toBeInTheDocument();
  });

  it('should display only assistant coaches, not head coaches', () => {
    render(<CoachListTable coaches={mockCoaches} students={mockStudents} batches={mockBatches} />);

    // Should show assistant coaches
    expect(screen.getByText('Priya Sharma')).toBeInTheDocument();
    expect(screen.getByText('Vikram Singh')).toBeInTheDocument();

    // Should not show head coach
    expect(screen.queryByText('Head Coach')).not.toBeInTheDocument();
  });

  it('should display correct assigned student count for each coach', () => {
    render(<CoachListTable coaches={mockCoaches} students={mockStudents} batches={mockBatches} />);

    // Find all cells with font-medium (student count cells)
    const rows = screen.getAllByRole('row');
    
    // Coach 1 should have 2 students
    const coach1Row = rows.find((row) => row.textContent?.includes('Priya Sharma'));
    expect(coach1Row?.textContent).toContain('2'); // 2 students

    // Coach 2 should have 1 student
    const coach2Row = rows.find((row) => row.textContent?.includes('Vikram Singh'));
    expect(coach2Row?.textContent).toContain('1'); // 1 student
  });

  it('should display correct assigned batch count for each coach', () => {
    render(<CoachListTable coaches={mockCoaches} students={mockStudents} batches={mockBatches} />);

    const rows = screen.getAllByRole('row');
    
    // Coach 1 should have 1 batch
    const coach1Row = rows.find((row) => row.textContent?.includes('Priya Sharma'));
    expect(coach1Row?.textContent).toContain('1'); // 1 batch

    // Coach 2 should have 1 batch
    const coach2Row = rows.find((row) => row.textContent?.includes('Vikram Singh'));
    expect(coach2Row?.textContent).toContain('1'); // 1 batch
  });

  it('should display coach specialization', () => {
    render(<CoachListTable coaches={mockCoaches} students={mockStudents} batches={mockBatches} />);

    expect(screen.getByText('Doubles Training')).toBeInTheDocument();
    expect(screen.getByText('Footwork')).toBeInTheDocument();
  });

  it('should display empty state when no assistant coaches', () => {
    const onlyHeadCoach: User[] = [
      {
        id: 'head-1',
        username: 'head',
        role: 'HEAD_COACH',
        name: 'Head Coach',
        email: 'head@test.com',
        createdAt: new Date('2026-01-01'),
        lastActive: new Date('2026-01-15'),
      },
    ];

    render(<CoachListTable coaches={onlyHeadCoach} students={[]} batches={[]} />);

    expect(screen.getByText('No assistant coaches found')).toBeInTheDocument();
  });

  it('should handle coaches with no assignments', () => {
    const unassignedCoach: User[] = [
      {
        id: 'coach-3',
        username: 'assistant3',
        role: 'ASSISTANT_COACH',
        name: 'New Coach',
        email: 'new@test.com',
        specialization: 'Service',
        createdAt: new Date('2026-01-01'),
        lastActive: new Date('2026-01-15'),
      },
    ];

    render(<CoachListTable coaches={unassignedCoach} students={[]} batches={[]} />);

    expect(screen.getByText('New Coach')).toBeInTheDocument();
    
    const rows = screen.getAllByRole('row');
    const coachRow = rows.find((row) => row.textContent?.includes('New Coach'));
    
    // Should show 0 for both batches and students
    expect(coachRow?.textContent).toContain('0');
  });

  it('should display coach email', () => {
    render(<CoachListTable coaches={mockCoaches} students={mockStudents} batches={mockBatches} />);

    expect(screen.getByText('priya@test.com')).toBeInTheDocument();
    expect(screen.getByText('vikram@test.com')).toBeInTheDocument();
  });

  it('should work without batches data', () => {
    render(<CoachListTable coaches={mockCoaches} students={mockStudents} />);

    // Should still render the table
    expect(screen.getByText('Priya Sharma')).toBeInTheDocument();
    expect(screen.getByText('Vikram Singh')).toBeInTheDocument();
    
    // Batch counts should be 0
    const rows = screen.getAllByRole('row');
    rows.forEach((row) => {
      if (row.textContent?.includes('Priya Sharma') || row.textContent?.includes('Vikram Singh')) {
        // Should have 0 batches assigned
        expect(row.textContent).toContain('0');
      }
    });
  });
});
