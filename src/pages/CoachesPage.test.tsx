import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CoachesPage from './CoachesPage';
import type { User, Student } from '../types';

// Mock the dependencies
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../hooks/useRoleGuard', () => ({
  useRoleGuard: vi.fn(),
}));

import { useAuth } from '../contexts/AuthContext';
import { useRoleGuard } from '../hooks/useRoleGuard';

// Mock fetch globally
global.fetch = vi.fn();

describe('CoachesPage', () => {
  const mockHeadCoach: User = {
    id: 'head-1',
    username: 'head_coach',
    role: 'HEAD_COACH',
    name: 'Head Coach',
    email: 'head@test.com',
    createdAt: new Date(),
    lastActive: new Date(),
  };

  const mockUsers: User[] = [
    mockHeadCoach,
    {
      id: 'coach-1',
      username: 'assistant1',
      role: 'ASSISTANT_COACH',
      name: 'Priya Sharma',
      email: 'priya@test.com',
      specialization: 'Doubles Training',
      createdAt: new Date('2026-01-02'),
      lastActive: new Date('2026-01-14'),
    },
    {
      id: 'coach-2',
      username: 'assistant2',
      role: 'ASSISTANT_COACH',
      name: 'Vikram Singh',
      email: 'vikram@test.com',
      specialization: 'Footwork',
      createdAt: new Date('2026-01-03'),
      lastActive: new Date('2026-01-13'),
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
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock authenticated head coach
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockHeadCoach,
      role: 'HEAD_COACH',
      token: 'test-token',
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    });

    // Mock successful fetch responses
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation((url: string) => {
      if (url.includes('users.json')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUsers),
        });
      }
      if (url.includes('students.json')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockStudents),
        });
      }
      if (url.includes('batches.json')) {
        return Promise.resolve({
          ok: false,
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render page header', async () => {
    renderWithRouter(<CoachesPage />);

    await waitFor(() => {
      expect(screen.getByText('Coach Management')).toBeInTheDocument();
    });

    expect(screen.getByText('View and manage assistant coaches and their assignments')).toBeInTheDocument();
  });

  it('should display loading state initially', () => {
    renderWithRouter(<CoachesPage />);

    // Check for loading skeleton
    const loadingElements = document.querySelectorAll('.animate-pulse');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('should load and display coach data', async () => {
    renderWithRouter(<CoachesPage />);

    await waitFor(() => {
      expect(screen.getByText('Priya Sharma')).toBeInTheDocument();
    });

    expect(screen.getByText('Vikram Singh')).toBeInTheDocument();
    expect(screen.getByText('Doubles Training')).toBeInTheDocument();
    expect(screen.getByText('Footwork')).toBeInTheDocument();
  });

  it('should fetch data from correct endpoints', async () => {
    renderWithRouter(<CoachesPage />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/src/data/users.json');
    });

    expect(global.fetch).toHaveBeenCalledWith('/src/data/students.json');
    expect(global.fetch).toHaveBeenCalledWith('/src/data/batches.json');
  });

  it('should display coach list table after loading', async () => {
    renderWithRouter(<CoachesPage />);

    await waitFor(() => {
      expect(screen.getByText('Coach Name')).toBeInTheDocument();
    });

    expect(screen.getByText('Specialization')).toBeInTheDocument();
    expect(screen.getByText('Assigned Batches')).toBeInTheDocument();
    expect(screen.getByText('Assigned Students')).toBeInTheDocument();
    expect(screen.getByText('Last Active')).toBeInTheDocument();
  });

  it('should handle fetch errors gracefully', async () => {
    // Mock fetch to throw error
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

    renderWithRouter(<CoachesPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load coach data. Please try again.')).toBeInTheDocument();
    });
  });

  it('should handle missing batches.json file gracefully', async () => {
    // This is the default mock behavior (batches.json returns ok: false)
    renderWithRouter(<CoachesPage />);

    await waitFor(() => {
      expect(screen.getByText('Priya Sharma')).toBeInTheDocument();
    });

    // Should still render coaches even if batches fail
    expect(screen.getByText('Vikram Singh')).toBeInTheDocument();
  });

  it('should call useRoleGuard with HEAD_COACH role', () => {
    renderWithRouter(<CoachesPage />);

    expect(useRoleGuard).toHaveBeenCalledWith(['HEAD_COACH']);
  });

  it('should display assigned student counts', async () => {
    renderWithRouter(<CoachesPage />);

    await waitFor(() => {
      expect(screen.getByText('Priya Sharma')).toBeInTheDocument();
    });

    // Coach 1 has 2 students assigned
    const rows = screen.getAllByRole('row');
    const coach1Row = rows.find((row) => row.textContent?.includes('Priya Sharma'));
    expect(coach1Row?.textContent).toContain('2');
  });
});
