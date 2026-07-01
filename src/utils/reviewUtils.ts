/**
 * Review Reminder Utilities
 * Functions to check if students are due for bi-monthly skill assessment
 * Requirement 28: Bi-monthly Review Reminder
 */

import type { SkillAssessment } from '../types';

/**
 * Check if a student is due for assessment based on last assessment date
 * Returns true if more than 60 days have passed since last assessment
 * 
 * @param lastAssessmentDate - Date of the last skill assessment
 * @returns true if student is due for assessment (> 60 days), false otherwise
 */
export function isDueForAssessment(lastAssessmentDate: Date | null | undefined): boolean {
  // If no assessment exists, student is due for review
  if (!lastAssessmentDate) {
    return true;
  }

  const today = new Date();
  const lastDate = new Date(lastAssessmentDate);
  
  const daysSinceLastAssessment = Math.floor(
    (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysSinceLastAssessment > 60;
}

/**
 * Calculate the number of days since last assessment
 * 
 * @param lastAssessmentDate - Date of the last skill assessment
 * @returns number of days since last assessment, or null if no assessment exists
 */
export function daysSinceLastAssessment(lastAssessmentDate: Date | null | undefined): number | null {
  if (!lastAssessmentDate) {
    return null;
  }

  const today = new Date();
  const lastDate = new Date(lastAssessmentDate);
  
  return Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Calculate the number of days overdue for an assessment
 * Returns 0 if not overdue, positive number if overdue
 * 
 * @param lastAssessmentDate - Date of the last skill assessment
 * @returns number of days overdue (0 if not overdue)
 */
export function daysOverdue(lastAssessmentDate: Date | null | undefined): number {
  const days = daysSinceLastAssessment(lastAssessmentDate);
  
  if (days === null) {
    // No assessment - calculate from "never assessed" (treat as infinitely overdue)
    // For display purposes, we'll show a large number
    return 9999;
  }
  
  if (days > 60) {
    return days - 60;
  }
  
  return 0;
}

/**
 * Get the most recent assessment for a student from a list of assessments
 * 
 * @param assessments - Array of skill assessments
 * @param studentId - ID of the student
 * @returns Most recent assessment or null if none exists
 */
export function getLastAssessment(
  assessments: SkillAssessment[],
  studentId: string
): SkillAssessment | null {
  const studentAssessments = assessments.filter(a => a.studentId === studentId);
  
  if (studentAssessments.length === 0) {
    return null;
  }
  
  // Sort by recordedAt date (most recent first)
  studentAssessments.sort((a, b) => {
    const dateA = new Date(a.recordedAt).getTime();
    const dateB = new Date(b.recordedAt).getTime();
    return dateB - dateA;
  });
  
  return studentAssessments[0];
}

/**
 * Filter students who are due for assessment
 * 
 * @param students - Array of students with their last assessment dates
 * @returns Array of student IDs who are due for assessment
 */
export function filterStudentsDueForReview(
  studentAssessments: Map<string, Date | null>
): string[] {
  const dueStudents: string[] = [];
  
  studentAssessments.forEach((lastAssessmentDate, studentId) => {
    if (isDueForAssessment(lastAssessmentDate)) {
      dueStudents.push(studentId);
    }
  });
  
  return dueStudents;
}
