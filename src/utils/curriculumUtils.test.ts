/**
 * Tests for Curriculum Utilities
 */

import { describe, it, expect } from 'vitest';
import {
  validateCurriculumConstraint,
  isBatchPlan,
  isIndividualPlan,
  isClonedFromBatch,
  hasValidWeekCount,
  hasValidWeekNumbers,
  validateCurriculumPlan,
  getCurriculumDisplayName
} from './curriculumUtils';
import type { CurriculumPlan, WeekPlan } from '../types';

// Helper to create a valid 8-week array
const createValidWeeks = (): WeekPlan[] => {
  return Array.from({ length: 8 }, (_, i) => ({
    weekNumber: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
    focusArea: `Week ${i + 1} Focus`,
    drills: [],
    objective: `Week ${i + 1} Objective`
  }));
};

// Helper to create a base curriculum plan
const createBasePlan = (overrides: Partial<CurriculumPlan> = {}): CurriculumPlan => ({
  id: 'test-plan-001',
  cycleKey: 'Jan-Feb 2026',
  weeks: createValidWeeks(),
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
  isArchived: false,
  ...overrides
});

describe('validateCurriculumConstraint', () => {
  it('should return true for valid batch plan (has batchId, no studentId)', () => {
    const plan = createBasePlan({ batchId: 'batch-001' });
    expect(validateCurriculumConstraint(plan)).toBe(true);
  });

  it('should return true for valid individual plan (has studentId, no batchId)', () => {
    const plan = createBasePlan({ studentId: 'student-001' });
    expect(validateCurriculumConstraint(plan)).toBe(true);
  });

  it('should return false when both batchId and studentId are present', () => {
    const plan = createBasePlan({ batchId: 'batch-001', studentId: 'student-001' });
    expect(validateCurriculumConstraint(plan)).toBe(false);
  });

  it('should return false when neither batchId nor studentId are present', () => {
    const plan = createBasePlan({});
    expect(validateCurriculumConstraint(plan)).toBe(false);
  });

  it('should return false when both are undefined', () => {
    const plan = createBasePlan({ batchId: undefined, studentId: undefined });
    expect(validateCurriculumConstraint(plan)).toBe(false);
  });
});

describe('isBatchPlan', () => {
  it('should return true for batch plan', () => {
    const plan = createBasePlan({ batchId: 'batch-001' });
    expect(isBatchPlan(plan)).toBe(true);
  });

  it('should return false for individual plan', () => {
    const plan = createBasePlan({ studentId: 'student-001' });
    expect(isBatchPlan(plan)).toBe(false);
  });

  it('should return false when both are set', () => {
    const plan = createBasePlan({ batchId: 'batch-001', studentId: 'student-001' });
    expect(isBatchPlan(plan)).toBe(false);
  });
});

describe('isIndividualPlan', () => {
  it('should return true for individual plan', () => {
    const plan = createBasePlan({ studentId: 'student-001' });
    expect(isIndividualPlan(plan)).toBe(true);
  });

  it('should return false for batch plan', () => {
    const plan = createBasePlan({ batchId: 'batch-001' });
    expect(isIndividualPlan(plan)).toBe(false);
  });

  it('should return false when both are set', () => {
    const plan = createBasePlan({ batchId: 'batch-001', studentId: 'student-001' });
    expect(isIndividualPlan(plan)).toBe(false);
  });
});

describe('isClonedFromBatch', () => {
  it('should return true for individual plan with sourceBatchPlanId', () => {
    const plan = createBasePlan({ 
      studentId: 'student-001',
      sourceBatchPlanId: 'curriculum-001'
    });
    expect(isClonedFromBatch(plan)).toBe(true);
  });

  it('should return false for individual plan without sourceBatchPlanId', () => {
    const plan = createBasePlan({ studentId: 'student-001' });
    expect(isClonedFromBatch(plan)).toBe(false);
  });

  it('should return false for batch plan even with sourceBatchPlanId', () => {
    const plan = createBasePlan({ 
      batchId: 'batch-001',
      sourceBatchPlanId: 'curriculum-001'
    });
    expect(isClonedFromBatch(plan)).toBe(false);
  });
});

describe('hasValidWeekCount', () => {
  it('should return true for plan with 8 weeks', () => {
    const plan = createBasePlan({ batchId: 'batch-001' });
    expect(hasValidWeekCount(plan)).toBe(true);
  });

  it('should return false for plan with fewer than 8 weeks', () => {
    const plan = createBasePlan({ 
      batchId: 'batch-001',
      weeks: createValidWeeks().slice(0, 6)
    });
    expect(hasValidWeekCount(plan)).toBe(false);
  });

  it('should return false for plan with more than 8 weeks', () => {
    const plan = createBasePlan({ 
      batchId: 'batch-001',
      weeks: [...createValidWeeks(), ...createValidWeeks().slice(0, 2)]
    });
    expect(hasValidWeekCount(plan)).toBe(false);
  });
});

describe('hasValidWeekNumbers', () => {
  it('should return true for sequential week numbers 1-8', () => {
    const plan = createBasePlan({ batchId: 'batch-001' });
    expect(hasValidWeekNumbers(plan)).toBe(true);
  });

  it('should return false for non-sequential week numbers', () => {
    const weeks = createValidWeeks();
    weeks[3].weekNumber = 5; // Skip week 4
    const plan = createBasePlan({ batchId: 'batch-001', weeks });
    expect(hasValidWeekNumbers(plan)).toBe(false);
  });

  it('should return false for duplicate week numbers', () => {
    const weeks = createValidWeeks();
    weeks[5].weekNumber = 3; // Duplicate week 3
    const plan = createBasePlan({ batchId: 'batch-001', weeks });
    expect(hasValidWeekNumbers(plan)).toBe(false);
  });

  it('should return false when week count is not 8', () => {
    const plan = createBasePlan({ 
      batchId: 'batch-001',
      weeks: createValidWeeks().slice(0, 5)
    });
    expect(hasValidWeekNumbers(plan)).toBe(false);
  });
});

describe('validateCurriculumPlan', () => {
  it('should return valid for a correct batch plan', () => {
    const plan = createBasePlan({ batchId: 'batch-001' });
    const result = validateCurriculumPlan(plan);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return valid for a correct individual plan', () => {
    const plan = createBasePlan({ studentId: 'student-001' });
    const result = validateCurriculumPlan(plan);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return errors when constraint is violated', () => {
    const plan = createBasePlan({ batchId: 'batch-001', studentId: 'student-001' });
    const result = validateCurriculumPlan(plan);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Plan must have either batchId OR studentId, but not both');
  });

  it('should return errors when week count is invalid', () => {
    const plan = createBasePlan({ 
      batchId: 'batch-001',
      weeks: createValidWeeks().slice(0, 6)
    });
    const result = validateCurriculumPlan(plan);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Plan must have exactly 8 weeks, found 6');
  });

  it('should return errors when week numbers are invalid', () => {
    const weeks = createValidWeeks();
    weeks[5].weekNumber = 3; // Duplicate week 3
    const plan = createBasePlan({ batchId: 'batch-001', weeks });
    const result = validateCurriculumPlan(plan);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Plan must have sequential week numbers from 1 to 8');
  });

  it('should return multiple errors when multiple validations fail', () => {
    const plan = createBasePlan({ 
      weeks: createValidWeeks().slice(0, 5) // Neither batchId nor studentId, and wrong week count
    });
    const result = validateCurriculumPlan(plan);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });
});

describe('getCurriculumDisplayName', () => {
  it('should return batch name for batch plan', () => {
    const plan = createBasePlan({ batchId: 'batch-001' });
    const name = getCurriculumDisplayName(plan, 'Morning Beginner');
    expect(name).toBe('Batch: Morning Beginner');
  });

  it('should return batchId if batch name not provided', () => {
    const plan = createBasePlan({ batchId: 'batch-001' });
    const name = getCurriculumDisplayName(plan);
    expect(name).toBe('Batch: batch-001');
  });

  it('should return student name for individual plan', () => {
    const plan = createBasePlan({ studentId: 'student-001' });
    const name = getCurriculumDisplayName(plan, undefined, 'Arjun Verma');
    expect(name).toBe('Individual: Arjun Verma');
  });

  it('should indicate modified plan for cloned individual plan', () => {
    const plan = createBasePlan({ 
      studentId: 'student-001',
      sourceBatchPlanId: 'curriculum-001'
    });
    const name = getCurriculumDisplayName(plan, undefined, 'Arjun Verma');
    expect(name).toBe('Individual (Modified): Arjun Verma');
  });

  it('should return studentId if student name not provided', () => {
    const plan = createBasePlan({ studentId: 'student-001' });
    const name = getCurriculumDisplayName(plan);
    expect(name).toBe('Individual: student-001');
  });

  it('should return "Invalid Plan" for plan violating constraint', () => {
    const plan = createBasePlan({ batchId: 'batch-001', studentId: 'student-001' });
    const name = getCurriculumDisplayName(plan);
    expect(name).toBe('Invalid Plan');
  });

  it('should return "Invalid Plan" for plan with neither id', () => {
    const plan = createBasePlan({});
    const name = getCurriculumDisplayName(plan);
    expect(name).toBe('Invalid Plan');
  });
});
