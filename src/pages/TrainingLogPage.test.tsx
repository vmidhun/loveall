import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Route, Routes, MemoryRouter } from 'react-router-dom';
import TrainingLogPage from './TrainingLogPage';
import { AuthContext } from '../contexts/AuthContext';
import type { User, UserRole, AuthContext as AuthContextType } from '../types';

// Mock data
const mockUser: User = {
  id: 'user-002',
  username: 'assistant_coach1',
  role: 'ASSISTANT_COACH' as UserRole,
  name: 'Priya Sharma',
  email: 'priya@shuttlecoach.com',
  createdAt: new Date('2026-01-02'),
  lastActive: new Date('2026-01-14'),
};

const mockAuthContext: AuthContextType = {
  user: mockUser,
  role: 'ASSISTANT_COACH' as UserRole,
  token: 'mock-token',
  isAuthenticated: true,
  login: vi.fn(),
  logout: vi.fn(),
};

// Helper to render with router and auth context
const renderWithContext = (studentId: string, authContext = mockAuthContext) => {
  return render(
    <AuthContext.Provider value={authContext}>
      <MemoryRouter initialEntries={[`/training-log/${studentId}`]}>
        <Routes>
          <Route path="/training-log/:studentId" element={<TrainingLogPage />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('TrainingLogPage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders the training log page with student name', () => {
    renderWithContext('student-001');

    expect(screen.getByText(/Training Log -/)).toBeInTheDocument();
    expect(screen.getByText(/Arjun Verma/)).toBeInTheDocument();
  });

  it('displays week selector buttons (1-8)', () => {
    renderWithContext('student-001');

    for (let week = 1; week <= 8; week++) {
      expect(screen.getByRole('button', { name: week.toString() })).toBeInTheDocument();
    }
  });

  it('displays current cycle key', () => {
    renderWithContext('student-001');

    // Current cycle should be visible (e.g., "Jan-Feb 2026")
    expect(screen.getByText(/Current Cycle:/)).toBeInTheDocument();
  });

  it('allows entering session notes', () => {
    renderWithContext('student-001');

    const textarea = screen.getByPlaceholderText(/Describe the training session/);
    fireEvent.change(textarea, { target: { value: 'Great progress today!' } });

    expect(textarea).toHaveValue('Great progress today!');
  });

  it('allows toggling mark completed checkbox', () => {
    renderWithContext('student-001');

    const checkbox = screen.getByRole('checkbox', { name: /Mark week as completed/i });
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('shows error when trying to save without session notes', async () => {
    renderWithContext('student-001');

    const saveButton = screen.getByRole('button', { name: /Save Training Log/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Please enter session notes before saving/i)).toBeInTheDocument();
    });
  });

  it('saves training log successfully', async () => {
    renderWithContext('student-001');

    // Select week 2
    const week2Button = screen.getByRole('button', { name: '2' });
    fireEvent.click(week2Button);

    // Enter session notes
    const textarea = screen.getByPlaceholderText(/Describe the training session/);
    fireEvent.change(textarea, {
      target: { value: 'Excellent footwork drills today. Student showing improvement.' },
    });

    // Mark as completed
    const checkbox = screen.getByRole('checkbox', { name: /Mark week as completed/i });
    fireEvent.click(checkbox);

    // Save
    const saveButton = screen.getByRole('button', { name: /Save Training Log/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Training log saved successfully!/i)).toBeInTheDocument();
    });

    // Verify localStorage
    const storedLogs = JSON.parse(localStorage.getItem('trainingLogs') || '[]');
    const savedLog = storedLogs.find(
      (log: any) =>
        log.studentId === 'student-001' &&
        log.weekNumber === 2 &&
        log.sessionNotes === 'Excellent footwork drills today. Student showing improvement.'
    );

    expect(savedLog).toBeDefined();
    expect(savedLog.isCompleted).toBe(true);
    expect(savedLog.recordedBy).toBe('Priya Sharma');
  });

  it('displays past training logs in reverse chronological order', () => {
    // Pre-populate localStorage with training logs
    const mockLogs = [
      {
        id: 'log-001',
        studentId: 'student-001',
        weekNumber: 1,
        cycleKey: 'Jan-Feb 2026',
        sessionNotes: 'First session notes',
        isCompleted: true,
        recordedBy: 'Priya Sharma',
        recordedAt: '2026-01-10T14:30:00Z',
      },
      {
        id: 'log-002',
        studentId: 'student-001',
        weekNumber: 2,
        cycleKey: 'Jan-Feb 2026',
        sessionNotes: 'Second session notes',
        isCompleted: false,
        recordedBy: 'Priya Sharma',
        recordedAt: '2026-01-17T14:30:00Z',
      },
    ];
    localStorage.setItem('trainingLogs', JSON.stringify(mockLogs));

    renderWithContext('student-001');

    // Should display both logs
    expect(screen.getByText('First session notes')).toBeInTheDocument();
    expect(screen.getByText('Second session notes')).toBeInTheDocument();

    // Most recent (log-002) should appear first
    const logs = screen.getAllByText(/Week \d+ -/);
    expect(logs[0]).toHaveTextContent('Week 2');
    expect(logs[1]).toHaveTextContent('Week 1');
  });

  it('shows completed badge for completed training logs', () => {
    const mockLogs = [
      {
        id: 'log-001',
        studentId: 'student-001',
        weekNumber: 1,
        cycleKey: 'Jan-Feb 2026',
        sessionNotes: 'Completed session',
        isCompleted: true,
        recordedBy: 'Priya Sharma',
        recordedAt: '2026-01-10T14:30:00Z',
      },
    ];
    localStorage.setItem('trainingLogs', JSON.stringify(mockLogs));

    renderWithContext('student-001');

    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('displays coach name who recorded the log', () => {
    renderWithContext('student-001');

    // Should show "Recording as: Priya Sharma"
    expect(screen.getByText(/Recording as:/)).toBeInTheDocument();
    // Use getAllByText since the name appears in the nav too
    const coachNames = screen.getAllByText('Priya Sharma');
    expect(coachNames.length).toBeGreaterThan(0);
  });

  it('switches between weeks and loads existing log data', async () => {
    const mockLogs = [
      {
        id: 'log-001',
        studentId: 'student-001',
        weekNumber: 3,
        cycleKey: 'Jul-Aug 2026', // Use current cycle
        sessionNotes: 'Week 3 existing notes',
        isCompleted: true,
        recordedBy: 'Priya Sharma',
        recordedAt: '2026-07-20T14:30:00Z',
      },
    ];
    localStorage.setItem('trainingLogs', JSON.stringify(mockLogs));

    renderWithContext('student-001');

    // Click on week 3
    const week3Button = screen.getByRole('button', { name: '3' });
    fireEvent.click(week3Button);

    // Should load the existing notes
    await waitFor(() => {
      const textarea = screen.getByPlaceholderText(/Describe the training session/);
      expect(textarea).toHaveValue('Week 3 existing notes');
    });

    // Should also check the completed checkbox
    const checkbox = screen.getByRole('checkbox', { name: /Mark week as completed/i });
    expect(checkbox).toBeChecked();
  });

  it('displays empty state when no training logs exist', () => {
    // Clear any existing logs and use a different student
    localStorage.setItem('trainingLogs', JSON.stringify([]));
    renderWithContext('student-002');

    expect(
      screen.getByText(/No training logs recorded yet. Start by adding your first session notes above./i)
    ).toBeInTheDocument();
  });

  it('shows back to student profile button', () => {
    renderWithContext('student-001');

    const backButton = screen.getByRole('button', { name: /Back to Student Profile/i });
    expect(backButton).toBeInTheDocument();
  });
});
