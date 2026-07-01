/**
 * Curriculum Utilities
 * Functions for curriculum plan validation and manipulation
 */

import type { CurriculumPlan } from '../types';

/**
 * Validates that a curriculum plan satisfies the XOR constraint:
 * A plan must have EITHER batchId OR studentId, but NOT both.
 * 
 * @param plan - The curriculum plan to validate
 * @returns true if the constraint is satisfied, false otherwise
 * 
 * @example
 * // Valid batch plan
 * validateCurriculumConstraint({ batchId: 'batch-001', studentId: undefined, ... }) // true
 * 
 * // Valid individual plan
 * validateCurriculumConstraint({ batchId: undefined, studentId: 'student-001', ... }) // true
 * 
 * // Invalid - has both
 * validateCurriculumConstraint({ batchId: 'batch-001', studentId: 'student-001', ... }) // false
 * 
 * // Invalid - has neither
 * validateCurriculumConstraint({ batchId: undefined, studentId: undefined, ... }) // false
 */
export function validateCurriculumConstraint(plan: CurriculumPlan): boolean {
  const hasBatchId = Boolean(plan.batchId);
  const hasStudentId = Boolean(plan.studentId);
  
  // XOR: exactly one must be true
  return hasBatchId !== hasStudentId;
}

/**
 * Determines if a curriculum plan is a batch plan
 * 
 * @param plan - The curriculum plan to check
 * @returns true if this is a batch plan, false otherwise
 */
export function isBatchPlan(plan: CurriculumPlan): boolean {
  return Boolean(plan.batchId) && !plan.studentId;
}

/**
 * Determines if a curriculum plan is an individual student plan
 * 
 * @param plan - The curriculum plan to check
 * @returns true if this is an individual plan, false otherwise
 */
export function isIndividualPlan(plan: CurriculumPlan): boolean {
  return Boolean(plan.studentId) && !plan.batchId;
}

/**
 * Determines if an individual plan was copied from a batch plan
 * 
 * @param plan - The curriculum plan to check
 * @returns true if this individual plan has a source batch plan
 */
export function isClonedFromBatch(plan: CurriculumPlan): boolean {
  return isIndividualPlan(plan) && Boolean(plan.sourceBatchPlanId);
}

/**
 * Validates that a curriculum plan has exactly 8 weeks
 * 
 * @param plan - The curriculum plan to validate
 * @returns true if the plan has 8 weeks, false otherwise
 */
export function hasValidWeekCount(plan: CurriculumPlan): boolean {
  return plan.weeks.length === 8;
}

/**
 * Validates that all week numbers in a plan are sequential from 1 to 8
 * 
 * @param plan - The curriculum plan to validate
 * @returns true if week numbers are valid and sequential, false otherwise
 */
export function hasValidWeekNumbers(plan: CurriculumPlan): boolean {
  if (plan.weeks.length !== 8) return false;
  
  const weekNumbers = plan.weeks.map(w => w.weekNumber).sort((a, b) => a - b);
  return weekNumbers.every((num, index) => num === index + 1);
}

/**
 * Validates a complete curriculum plan
 * Checks all constraints:
 * - batchId XOR studentId constraint
 * - Exactly 8 weeks
 * - Valid sequential week numbers (1-8)
 * 
 * @param plan - The curriculum plan to validate
 * @returns Object with validation result and error messages
 */
export function validateCurriculumPlan(plan: CurriculumPlan): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!validateCurriculumConstraint(plan)) {
    errors.push('Plan must have either batchId OR studentId, but not both');
  }
  
  if (!hasValidWeekCount(plan)) {
    errors.push(`Plan must have exactly 8 weeks, found ${plan.weeks.length}`);
  }
  
  if (!hasValidWeekNumbers(plan)) {
    errors.push('Plan must have sequential week numbers from 1 to 8');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Gets the display name for a curriculum plan
 * Returns "Batch: [name]" for batch plans or "Student: [name]" for individual plans
 * 
 * @param plan - The curriculum plan
 * @param batchName - Name of the batch (if batch plan)
 * @param studentName - Name of the student (if individual plan)
 * @returns Display name string
 */
export function getCurriculumDisplayName(
  plan: CurriculumPlan,
  batchName?: string,
  studentName?: string
): string {
  if (isBatchPlan(plan)) {
    return `Batch: ${batchName || plan.batchId || 'Unknown'}`;
  }
  
  if (isIndividualPlan(plan)) {
    const prefix = isClonedFromBatch(plan) ? 'Individual (Modified):' : 'Individual:';
    return `${prefix} ${studentName || plan.studentId || 'Unknown'}`;
  }
  
  return 'Invalid Plan';
}
