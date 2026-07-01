/**
 * Tests for activity utility functions
 */

import { describe, it, expect } from 'vitest';
import { generateActivityFeed, getCoachWorkloads } from './activityUtils';
import type { Student, SkillAssessment, TrainingLog, User } from '../types';

describe('activityUtils', () => {
  const mockStudents: Student[] = [
    {
      id: 'student-1',
      fullName: 'Alice Smith',
      dateOfBirth: new Date('2010-01-01'),
      age: 16,
      gender: 'Female',
      contactPhone: '1234567890',
      assignedCoachId: 'coach-1',
      strengths: [],
      weaknesses: [],
      skillLevel: 'Beginner',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'student-2',
      fullName: 'Bob Johnson',
      dateOfBirth: new Date('2011-01-01'),
      age: 15,
      gender: 'Male',
      contactPhone: '0987654321',
      assignedCoachId: 'coach-1',
      strengths: [],
      weaknesses: [],
      skillLevel: 'Intermediate',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    {
      id: 'student-3',
      fullName: 'Carol White',
      dateOfBirth: new Date('2012-01-01'),
      age: 14,
      gender: 'Female',
      contactPhone: '5555555555',
      assignedCoachId: 'coach-2',
      strengths: [],
      weaknesses: [],
      skillLevel: 'Advanced',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
  ];

  const mockAssessments: SkillAssessment[] = [
    {
      id: 'assessment-1',
      studentId: 'student-1',
      cycleKey: 'Jan-Feb 2026',
      recordedBy: 'Coach John',
      recordedAt: new Date('2026-01-15'),
      scores: {
        forehand: {},
        backhand: {},
        return: {},
        service: {},
        overhead: {},
        rally: {},
      },
      isLocked: false,
    },
  ];

  const mockTrainingLogs: TrainingLog[] = [
    {
      id: 'log-1',
      studentId: 'student-2',
      weekNumber: 1,
      cycleKey: 'Jan-Feb 2026',
      sessionNotes: 'Great progress',
      isCompleted: true,
      recordedBy: 'Coach Sarah',
      recordedAt: new Date('2026-01-10'),
    },
  ];

  const mockCoaches: User[] = [
    {
      id: 'coach-1',
      username: 'coach1',
      role: 'ASSISTANT_COACH',
      name: 'Coach John',
      createdAt: new Date('2025-01-01'),
      lastActive: new Date('2026-01-15'),
    },
    {
      id: 'coach-2',
      username: 'coach2',
      role: 'ASSISTANT_COACH',
      name: 'Coach Sarah',
      createdAt: new Date('2025-01-01'),
      lastActive: new Date('2026-01-15'),
    },
    {
      id: 'coach-3',
      username: 'coach3',
      role: 'HEAD_COACH',
      name: 'Head Coach Mike',
      createdAt: new Date('2025-01-01'),
      lastActive: new Date('2026-01-15'),
    },
  ];

  describe('generateActivityFeed', () => {
    it('should generate activity feed with all types', () => {
      const activities = generateActivityFeed(
        mockAssessments,
        mockTrainingLogs,
        mockStudents,
        10
      );
      expect(Array.isArray(activities)).toBe(true);
      expect(activities.length).toBeGreaterThan(0);
    });

    it('should include assessment activities', () => {
      const activities = generateActivityFeed(
        mockAssessments,
        mockTrainingLogs,
        mockStudents,
        10
      );
      const assessmentActivities = activities.filter((a) => a.type === 'assessment');
      expect(assessmentActivities.length).toBeGreaterThanOrEqual(1);
    });

    it('should include training log activities', () => {
      const activities = generateActivityFeed(
        mockAssessments,
        mockTrainingLogs,
        mockStudents,
        10
      );
      const logActivities = activities.filter((a) => a.type === 'training_log');
      expect(logActivities.length).toBeGreaterThanOrEqual(1);
    });

    it('should include student added activities for recent students', () => {
      const activities = generateActivityFeed(
        mockAssessments,
        mockTrainingLogs,
        mockStudents,
        10
      );
      const studentAddedActivities = activities.filter((a) => a.type === 'student_added');
      // student-1 was created 5 days ago, should be included
      expect(studentAddedActivities.length).toBeGreaterThanOrEqual(1);
    });

    it('should sort activities by timestamp descending', () => {
      const activities = generateActivityFeed(
        mockAssessments,
        mockTrainingLogs,
        mockStudents,
        10
      );
      for (let i = 1; i < activities.length; i++) {
        expect(activities[i - 1].timestamp.getTime()).toBeGreaterThanOrEqual(
          activities[i].timestamp.getTime()
        );
      }
    });

    it('should respect the limit parameter', () => {
      const limit = 2;
      const activities = generateActivityFeed(
        mockAssessments,
        mockTrainingLogs,
        mockStudents,
        limit
      );
      expect(activities.length).toBeLessThanOrEqual(limit);
    });

    it('should have required activity properties', () => {
      const activities = generateActivityFeed(
        mockAssessments,
        mockTrainingLogs,
        mockStudents,
        10
      );
      activities.forEach((activity) => {
        expect(activity).toHaveProperty('id');
        expect(activity).toHaveProperty('type');
        expect(activity).toHaveProperty('title');
        expect(activity).toHaveProperty('description');
        expect(activity).toHaveProperty('timestamp');
        expect(activity).toHaveProperty('coachName');
      });
    });
  });

  describe('getCoachWorkloads', () => {
    it('should calculate workloads for all coaches', () => {
      const workloads = getCoachWorkloads(mockStudents, mockCoaches);
      expect(Array.isArray(workloads)).toBe(true);
      expect(workloads.length).toBe(3); // All 3 coaches
    });

    it('should calculate correct student counts', () => {
      const workloads = getCoachWorkloads(mockStudents, mockCoaches);
      const coach1Workload = workloads.find((w) => w.coachId === 'coach-1');
      expect(coach1Workload?.studentCount).toBe(2); // student-1 and student-2
      
      const coach2Workload = workloads.find((w) => w.coachId === 'coach-2');
      expect(coach2Workload?.studentCount).toBe(1); // student-3
    });

    it('should set correct workload status flags', () => {
      const workloads = getCoachWorkloads(mockStudents, mockCoaches);
      workloads.forEach((workload) => {
        if (workload.studentCount > 10) {
          expect(workload.isOverloaded).toBe(true);
        }
        if (workload.studentCount >= 5 && workload.studentCount <= 10) {
          expect(workload.isBalanced).toBe(true);
        }
        if (workload.studentCount < 5 && workload.studentCount > 0) {
          expect(workload.isUnderloaded).toBe(true);
        }
      });
    });

    it('should sort workloads by student count descending', () => {
      const workloads = getCoachWorkloads(mockStudents, mockCoaches);
      for (let i = 1; i < workloads.length; i++) {
        expect(workloads[i - 1].studentCount).toBeGreaterThanOrEqual(
          workloads[i].studentCount
        );
      }
    });

    it('should have required workload properties', () => {
      const workloads = getCoachWorkloads(mockStudents, mockCoaches);
      workloads.forEach((workload) => {
        expect(workload).toHaveProperty('coachId');
        expect(workload).toHaveProperty('coachName');
        expect(workload).toHaveProperty('studentCount');
        expect(workload).toHaveProperty('isOverloaded');
        expect(workload).toHaveProperty('isBalanced');
        expect(workload).toHaveProperty('isUnderloaded');
      });
    });
  });
});
