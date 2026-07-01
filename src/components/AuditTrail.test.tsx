/**
 * Audit Trail Tests
 * Verifies that recordedBy and recordedAt fields are displayed correctly
 * 
 * Requirements: 16.3, 16.4
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkillHistory } from './SkillHistory';
import type { SkillAssessment, SkillScores } from '../types';

describe('Audit Trail - Skill Assessments', () => {
  const mockScores: SkillScores = {
    forehand: { Clear: 3, Drop: 2, Smash: 3, Drive: 2, 'Net Shot': 2, Lift: 2, 'Cross Drop': 1, Slice: 1, Push: 1, Tap: 1 },
    backhand: { Clear: 2, Drop: 2, Smash: 1, Drive: 2, 'Net Shot': 2, Lift: 2, 'Cross Drop': 1, Slice: 1, Push: 1, Tap: 1 },
    return: { 'Short Return': 2, 'Deep Return': 2, 'Cross Return': 2, 'Fast Return': 2, 'Slow Return': 2, 'Attacking Return': 1, 'Defensive Return': 2, 'Flick Return': 1, 'Push Return': 1, 'Drive Return': 1 },
    service: { 'High Serve': 3, 'Low Serve': 2, 'Flick Serve': 2, 'Drive Serve': 1, 'Slice Serve': 1, 'Jump Serve': 0, 'Fastball Serve': 1, 'Deceptive Serve': 1, 'Side Service': 2, 'Midcourt Serve': 1 },
    overhead: { Smash: 3, Clear: 3, Drop: 2, Drive: 2, Lob: 2, 'Cross Smash': 2, 'Kill Shot': 1, 'Flat Drive': 1, 'Angled Smash': 1, 'Block Smash': 1 },
    rally: { 'Rally Control': 2, 'Attack Placement': 2, 'Defensive Positioning': 2, 'Court Movement': 3, 'Shot Selection': 2, 'Tempo Control': 2, 'Momentum Building': 2, 'Under Pressure': 2, Endurance: 3, 'Mental Resilience': 2 },
  };

  it('displays "Last updated by [Coach] on [Date]" for skill assessments', () => {
    const assessments: SkillAssessment[] = [
      {
        id: 'assessment-001',
        studentId: 'student-001',
        cycleKey: 'Jan-Feb 2026',
        recordedBy: 'Priya Sharma',
        recordedAt: new Date('2026-01-15T14:30:00Z'),
        scores: mockScores,
        isLocked: true,
      },
    ];

    render(<SkillHistory assessments={assessments} />);

    // Check that audit info is displayed
    const auditInfo = screen.getByTestId('skill-history-audit-info');
    expect(auditInfo).toBeInTheDocument();
    expect(auditInfo.textContent).toContain('Last updated by Priya Sharma');
    expect(auditInfo.textContent).toContain('on');
    expect(auditInfo.textContent).toContain('Jan 15, 2026');
    expect(auditInfo.textContent).toMatch(/at \d{1,2}:\d{2} (AM|PM)/);
  });

  it('displays coach name in audit trail', () => {
    const assessments: SkillAssessment[] = [
      {
        id: 'assessment-001',
        studentId: 'student-001',
        cycleKey: 'Jan-Feb 2026',
        recordedBy: 'Sumit Dali',
        recordedAt: new Date('2026-02-10T09:15:00Z'),
        scores: mockScores,
        isLocked: true,
      },
    ];

    render(<SkillHistory assessments={assessments} />);

    expect(screen.getByText(/Sumit Dali/)).toBeInTheDocument();
  });

  it('displays timestamp in readable format', () => {
    const assessments: SkillAssessment[] = [
      {
        id: 'assessment-001',
        studentId: 'student-001',
        cycleKey: 'Mar-Apr 2026',
        recordedBy: 'Vikram Singh',
        recordedAt: new Date('2026-03-20T16:45:00Z'),
        scores: mockScores,
        isLocked: true,
      },
    ];

    render(<SkillHistory assessments={assessments} />);

    const auditInfo = screen.getByTestId('skill-history-audit-info');
    // Check for readable date format
    expect(auditInfo.textContent).toContain('Mar 20, 2026');
    // Check for time with AM/PM
    expect(auditInfo.textContent).toMatch(/\d{1,2}:\d{2} (AM|PM)/);
  });

  it('displays multiple assessments with correct audit information', () => {
    const assessments: SkillAssessment[] = [
      {
        id: 'assessment-001',
        studentId: 'student-001',
        cycleKey: 'Jan-Feb 2026',
        recordedBy: 'Priya Sharma',
        recordedAt: new Date('2026-01-15T14:30:00Z'),
        scores: mockScores,
        isLocked: true,
      },
      {
        id: 'assessment-002',
        studentId: 'student-001',
        cycleKey: 'Mar-Apr 2026',
        recordedBy: 'Vikram Singh',
        recordedAt: new Date('2026-03-20T10:00:00Z'),
        scores: mockScores,
        isLocked: true,
      },
    ];

    render(<SkillHistory assessments={assessments} />);

    // Both coach names should be present
    expect(screen.getByText(/Priya Sharma/)).toBeInTheDocument();
    expect(screen.getByText(/Vikram Singh/)).toBeInTheDocument();

    // Both dates should be present
    expect(screen.getByText(/Jan 15, 2026/)).toBeInTheDocument();
    expect(screen.getByText(/Mar 20, 2026/)).toBeInTheDocument();
  });

  it('handles ISO string dates correctly', () => {
    const assessments: SkillAssessment[] = [
      {
        id: 'assessment-001',
        studentId: 'student-001',
        cycleKey: 'Jan-Feb 2026',
        recordedBy: 'Priya Sharma',
        recordedAt: '2026-01-15T14:30:00Z' as unknown as Date, // Simulating JSON-parsed date
        scores: mockScores,
        isLocked: true,
      },
    ];

    render(<SkillHistory assessments={assessments} />);

    const auditInfo = screen.getByTestId('skill-history-audit-info');
    expect(auditInfo.textContent).toContain('Last updated by Priya Sharma');
    expect(auditInfo.textContent).toContain('Jan 15, 2026');
  });
});
