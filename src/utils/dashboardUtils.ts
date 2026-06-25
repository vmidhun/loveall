import type { Student } from '../types';

/**
 * Dashboard Statistics Calculation Utilities
 * Computes all statistics for the HeadCoachDashboard
 */

/**
 * Calculate total number of students
 */
export const calculateTotalStudents = (students: Student[]): number => {
  return students.length;
};

/**
 * Calculate number of BAID-registered students
 */
export const calculateBaidRegistered = (students: Student[]): number => {
  return students.filter((s) => s.baidNumber && s.baidNumber.trim() !== '').length;
};

/**
 * Calculate BAID registration percentage
 */
export const calculateBaidPercentage = (students: Student[]): number => {
  const total = calculateTotalStudents(students);
  if (total === 0) return 0;
  const registered = calculateBaidRegistered(students);
  return Math.round((registered / total) * 100);
};

/**
 * Calculate number of distinct batches
 */
export const calculateBatchCount = (students: Student[]): number => {
  const batchIds = new Set<string>();
  students.forEach((s) => {
    if (s.batchId) {
      batchIds.add(s.batchId);
    }
  });
  return batchIds.size;
};

/**
 * Convert skill level to numeric value for averaging
 */
const getSkillLevelValue = (skillLevel: string): number => {
  switch (skillLevel) {
    case 'Beginner':
      return 1;
    case 'Intermediate':
      return 2;
    case 'Advanced':
      return 3;
    case 'Professional':
      return 4;
    default:
      return 0;
  }
};

/**
 * Convert numeric value back to skill level
 */
const getSkillLevelFromValue = (value: number): string => {
  if (value >= 3.5) return 'Professional';
  if (value >= 2.5) return 'Advanced';
  if (value >= 1.5) return 'Intermediate';
  if (value >= 0.5) return 'Beginner';
  return 'Beginner';
};

/**
 * Calculate average skill level across all students
 */
export const calculateAverageProgress = (students: Student[]): number => {
  if (students.length === 0) return 0;
  const sum = students.reduce((acc, s) => acc + getSkillLevelValue(s.skillLevel), 0);
  const average = sum / students.length;
  return Math.round(average * 10) / 10; // Round to 1 decimal place
};

/**
 * Calculate average skill level as a formatted string
 */
export const calculateAverageProgressLabel = (students: Student[]): string => {
  const average = calculateAverageProgress(students);
  const skillLevel = getSkillLevelFromValue(average);
  return `${average} (${skillLevel})`;
};

/**
 * Get all dashboard statistics at once
 */
export interface DashboardStats {
  totalStudents: number;
  baidRegistered: number;
  baidPercentage: number;
  batchCount: number;
  averageProgress: number;
  averageProgressLabel: string;
}

export const calculateDashboardStats = (students: Student[]): DashboardStats => {
  return {
    totalStudents: calculateTotalStudents(students),
    baidRegistered: calculateBaidRegistered(students),
    baidPercentage: calculateBaidPercentage(students),
    batchCount: calculateBatchCount(students),
    averageProgress: calculateAverageProgress(students),
    averageProgressLabel: calculateAverageProgressLabel(students),
  };
};
