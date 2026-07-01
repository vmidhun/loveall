import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  isDueForAssessment,
  daysSinceLastAssessment,
  daysOverdue,
  getLastAssessment,
  filterStudentsDueForReview,
} from './reviewUtils';
import type { SkillAssessment, SkillScores } from '../types';

describe('reviewUtils', () => {
  // Mock current date for consistent testing
  const MOCK_NOW = new Date('2025-06-15T00:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(MOCK_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('isDueForAssessment', () => {
    it('returns true when no assessment exists', () => {
      expect(isDueForAssessment(null)).toBe(true);
      expect(isDueForAssessment(undefined)).toBe(true);
    });

    it('returns true when last assessment was more than 60 days ago', () => {
      const date61DaysAgo = new Date('2025-04-15T00:00:00Z'); // 61 days ago
      expect(isDueForAssessment(date61DaysAgo)).toBe(true);
    });

    it('returns false when last assessment was exactly 60 days ago', () => {
      const date60DaysAgo = new Date('2025-04-16T00:00:00Z'); // 60 days ago
      expect(isDueForAssessment(date60DaysAgo)).toBe(false);
    });

    it('returns false when last assessment was less than 60 days ago', () => {
      const date30DaysAgo = new Date('2025-05-16T00:00:00Z'); // 30 days ago
      expect(isDueForAssessment(date30DaysAgo)).toBe(false);
    });

    it('returns false when assessment was today', () => {
      const today = new Date('2025-06-15T00:00:00Z');
      expect(isDueForAssessment(today)).toBe(false);
    });
  });

  describe('daysSinceLastAssessment', () => {
    it('returns null when no assessment exists', () => {
      expect(daysSinceLastAssessment(null)).toBeNull();
      expect(daysSinceLastAssessment(undefined)).toBeNull();
    });

    it('calculates days correctly', () => {
      const date30DaysAgo = new Date('2025-05-16T00:00:00Z');
      expect(daysSinceLastAssessment(date30DaysAgo)).toBe(30);
    });

    it('returns 0 for today', () => {
      const today = new Date('2025-06-15T00:00:00Z');
      expect(daysSinceLastAssessment(today)).toBe(0);
    });

    it('calculates 61 days correctly', () => {
      const date61DaysAgo = new Date('2025-04-15T00:00:00Z');
      expect(daysSinceLastAssessment(date61DaysAgo)).toBe(61);
    });
  });

  describe('daysOverdue', () => {
    it('returns 9999 when no assessment exists', () => {
      expect(daysOverdue(null)).toBe(9999);
      expect(daysOverdue(undefined)).toBe(9999);
    });

    it('returns 0 when not overdue', () => {
      const date30DaysAgo = new Date('2025-05-16T00:00:00Z');
      expect(daysOverdue(date30DaysAgo)).toBe(0);
    });

    it('returns 0 when exactly 60 days', () => {
      const date60DaysAgo = new Date('2025-04-16T00:00:00Z');
      expect(daysOverdue(date60DaysAgo)).toBe(0);
    });

    it('returns 1 when 61 days have passed', () => {
      const date61DaysAgo = new Date('2025-04-15T00:00:00Z');
      expect(daysOverdue(date61DaysAgo)).toBe(1);
    });

    it('returns 30 when 90 days have passed', () => {
      const date90DaysAgo = new Date('2025-03-17T00:00:00Z');
      expect(daysOverdue(date90DaysAgo)).toBe(30);
    });
  });

  describe('getLastAssessment', () => {
    const mockScores: SkillScores = {
      forehand: {},
      backhand: {},
      return: {},
      service: {},
      overhead: {},
      rally: {},
    };

    it('returns null when no assessments exist', () => {
      expect(getLastAssessment([], 'student-1')).toBeNull();
    });

    it('returns null when no assessments exist for the student', () => {
      const assessments: SkillAssessment[] = [
        {
          id: 'a1',
          studentId: 'student-2',
          cycleKey: 'Jan-Feb 2025',
          recordedBy: 'Coach',
          recordedAt: new Date('2025-01-15'),
          scores: mockScores,
          isLocked: false,
        },
      ];
      expect(getLastAssessment(assessments, 'student-1')).toBeNull();
    });

    it('returns the only assessment for a student', () => {
      const assessment: SkillAssessment = {
        id: 'a1',
        studentId: 'student-1',
        cycleKey: 'Jan-Feb 2025',
        recordedBy: 'Coach',
        recordedAt: new Date('2025-01-15'),
        scores: mockScores,
        isLocked: false,
      };
      const assessments: SkillAssessment[] = [assessment];
      expect(getLastAssessment(assessments, 'student-1')).toEqual(assessment);
    });

    it('returns the most recent assessment when multiple exist', () => {
      const older: SkillAssessment = {
        id: 'a1',
        studentId: 'student-1',
        cycleKey: 'Jan-Feb 2025',
        recordedBy: 'Coach',
        recordedAt: new Date('2025-01-15'),
        scores: mockScores,
        isLocked: true,
      };
      const newer: SkillAssessment = {
        id: 'a2',
        studentId: 'student-1',
        cycleKey: 'Mar-Apr 2025',
        recordedBy: 'Coach',
        recordedAt: new Date('2025-03-20'),
        scores: mockScores,
        isLocked: false,
      };
      const assessments: SkillAssessment[] = [older, newer];
      expect(getLastAssessment(assessments, 'student-1')).toEqual(newer);
    });

    it('returns the most recent assessment when provided in wrong order', () => {
      const newer: SkillAssessment = {
        id: 'a2',
        studentId: 'student-1',
        cycleKey: 'Mar-Apr 2025',
        recordedBy: 'Coach',
        recordedAt: new Date('2025-03-20'),
        scores: mockScores,
        isLocked: false,
      };
      const older: SkillAssessment = {
        id: 'a1',
        studentId: 'student-1',
        cycleKey: 'Jan-Feb 2025',
        recordedBy: 'Coach',
        recordedAt: new Date('2025-01-15'),
        scores: mockScores,
        isLocked: true,
      };
      const assessments: SkillAssessment[] = [newer, older];
      expect(getLastAssessment(assessments, 'student-1')).toEqual(newer);
    });
  });

  describe('filterStudentsDueForReview', () => {
    it('returns empty array when no students provided', () => {
      const studentAssessments = new Map<string, Date | null>();
      expect(filterStudentsDueForReview(studentAssessments)).toEqual([]);
    });

    it('returns students with no assessments', () => {
      const studentAssessments = new Map<string, Date | null>([
        ['student-1', null],
        ['student-2', null],
      ]);
      expect(filterStudentsDueForReview(studentAssessments)).toEqual([
        'student-1',
        'student-2',
      ]);
    });

    it('returns students with assessments over 60 days ago', () => {
      const studentAssessments = new Map<string, Date | null>([
        ['student-1', new Date('2025-04-15')], // 61 days ago
        ['student-2', new Date('2025-05-16')], // 30 days ago
      ]);
      expect(filterStudentsDueForReview(studentAssessments)).toEqual(['student-1']);
    });

    it('does not return students with recent assessments', () => {
      const studentAssessments = new Map<string, Date | null>([
        ['student-1', new Date('2025-05-16')], // 30 days ago
        ['student-2', new Date('2025-06-01')], // 14 days ago
      ]);
      expect(filterStudentsDueForReview(studentAssessments)).toEqual([]);
    });

    it('correctly filters mixed students', () => {
      const studentAssessments = new Map<string, Date | null>([
        ['student-1', new Date('2025-04-15')], // 61 days - DUE
        ['student-2', new Date('2025-05-16')], // 30 days - not due
        ['student-3', null], // No assessment - DUE
        ['student-4', new Date('2025-03-01')], // 106 days - DUE
      ]);
      expect(filterStudentsDueForReview(studentAssessments)).toEqual([
        'student-1',
        'student-3',
        'student-4',
      ]);
    });
  });
});
