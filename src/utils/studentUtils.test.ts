/**
 * Student Utils Tests
 * Unit tests for all student utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  calculateAge,
  calculateBMI,
  filterStudentsByBatch,
  filterStudentsByCoach,
  filterStudentsBySkillLevel,
  filterStudentsByMultipleCriteria,
  searchStudents,
} from './studentUtils';
import type { Student } from '../types';

/* ============================================================================
   TEST DATA
   ============================================================================ */

const mockStudents: Student[] = [
  {
    id: 'student-001',
    fullName: 'Arjun Verma',
    dateOfBirth: new Date('2012-05-15'),
    age: 13,
    gender: 'Male',
    contactPhone: '9876543210',
    email: 'arjun.v@email.com',
    guardianName: 'Rajesh Verma',
    guardianPhone: '9876543200',
    baidNumber: 'BAID-2026-001',
    batchId: 'batch-001',
    assignedCoachId: 'user-002',
    height: 155,
    weight: 48,
    bmi: 20.0,
    bloodGroup: 'O+',
    emergencyContact: '9876543200',
    strengths: ['Quick footwork', 'Backhand shot'],
    weaknesses: ['Service consistency'],
    coachFeedback: 'Good fundamentals, needs work on service technique.',
    skillLevel: 'Beginner',
    createdAt: new Date('2026-01-05T09:00:00Z'),
    updatedAt: new Date('2026-01-15T10:30:00Z'),
  },
  {
    id: 'student-002',
    fullName: 'Neha Sharma',
    dateOfBirth: new Date('2010-08-22'),
    age: 15,
    gender: 'Female',
    contactPhone: '9876543211',
    email: 'neha.s@email.com',
    guardianName: 'Priya Sharma',
    guardianPhone: '9876543201',
    baidNumber: 'BAID-2026-002',
    batchId: 'batch-001',
    assignedCoachId: 'user-002',
    height: 162,
    weight: 55,
    bmi: 20.9,
    bloodGroup: 'B+',
    emergencyContact: '9876543201',
    strengths: ['Court positioning', 'Drop shots'],
    weaknesses: ['Power in smash'],
    coachFeedback: 'Excellent court sense. Focus on building power in overhead shots.',
    skillLevel: 'Intermediate',
    createdAt: new Date('2026-01-06T09:00:00Z'),
    updatedAt: new Date('2026-01-14T14:00:00Z'),
  },
  {
    id: 'student-003',
    fullName: 'Rohan Kapoor',
    dateOfBirth: new Date('2008-03-10'),
    age: 17,
    gender: 'Male',
    contactPhone: '9876543212',
    email: 'rohan.k@email.com',
    guardianName: undefined,
    guardianPhone: undefined,
    baidNumber: 'BAID-2026-003',
    batchId: 'batch-002',
    assignedCoachId: 'user-003',
    height: 175,
    weight: 68,
    bmi: 22.2,
    bloodGroup: 'A+',
    emergencyContact: '9876543212',
    strengths: ['Rally play', 'Stamina', 'Attacking shots'],
    weaknesses: ['Defensive positioning'],
    coachFeedback: 'Strong attacker. Needs to develop defensive strategies for competitive matches.',
    skillLevel: 'Advanced',
    createdAt: new Date('2026-01-07T09:00:00Z'),
    updatedAt: new Date('2026-01-13T11:45:00Z'),
  },
  {
    id: 'student-004',
    fullName: 'Sapna Reddy',
    dateOfBirth: new Date('2009-07-30'),
    age: 16,
    gender: 'Female',
    contactPhone: '9876543219',
    email: 'sapna.r@email.com',
    guardianName: 'Suman Reddy',
    guardianPhone: '9876543206',
    baidNumber: 'BAID-2026-008',
    batchId: 'batch-003',
    assignedCoachId: 'user-003',
    height: 165,
    weight: 58,
    bmi: 21.3,
    bloodGroup: 'O+',
    emergencyContact: '9876543206',
    strengths: ['Control', 'Precision shots'],
    weaknesses: ['Baseline clearing'],
    coachFeedback: 'Excellent shot selection and precision. Needs to work on power and baseline play.',
    skillLevel: 'Advanced',
    createdAt: new Date('2026-01-14T09:00:00Z'),
    updatedAt: new Date('2026-01-15T14:40:00Z'),
  },
];

/* ============================================================================
   CALCULATE AGE TESTS
   ============================================================================ */

describe('calculateAge', () => {
  it('should calculate age correctly when birthday has passed this year', () => {
    // Born May 15, 2012. If today is after May 15, age should be 13
    const dob = new Date('2012-05-15');
    const age = calculateAge(dob);
    // Age calculation depends on current date, so we check the range
    expect(age).toBeGreaterThanOrEqual(12);
    expect(age).toBeLessThanOrEqual(14);
  });

  it('should calculate age correctly when birthday has not passed yet', () => {
    // Born December 25, 2010. If today is before Dec 25, subtract 1 from year difference
    const dob = new Date('2010-12-25');
    const age = calculateAge(dob);
    expect(age).toBeGreaterThanOrEqual(14);
    expect(age).toBeLessThanOrEqual(16);
  });

  it('should return 0 for null or undefined dateOfBirth', () => {
    const age = calculateAge(null as unknown as Date);
    expect(age).toBe(0);
  });

  it('should handle edge case of someone born today', () => {
    const today = new Date();
    const dob = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const age = calculateAge(dob);
    expect(age).toBe(18);
  });

  it('should handle edge case of someone born tomorrow last year', () => {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const dob = new Date(
      tomorrow.getFullYear() - 18,
      tomorrow.getMonth(),
      tomorrow.getDate()
    );
    const age = calculateAge(dob);
    expect(age).toBe(17); // Not yet 18 because birthday hasn't passed
  });
});

/* ============================================================================
   CALCULATE BMI TESTS
   ============================================================================ */

describe('calculateBMI', () => {
  it('should calculate BMI correctly for standard values', () => {
    // height 155cm, weight 48kg → (48 / (1.55^2)) = 20.0
    const bmi = calculateBMI(155, 48);
    expect(bmi).toBe(20.0);
  });

  it('should round BMI to 1 decimal place', () => {
    // height 180cm, weight 75kg → (75 / (1.80^2)) = 23.148... → 23.1
    const bmi = calculateBMI(180, 75);
    expect(bmi).toBe(23.1);
  });

  it('should handle different BMI ranges', () => {
    // Underweight: BMI < 18.5
    const underweight = calculateBMI(170, 50);
    expect(underweight).toBeLessThan(18.5);

    // Normal: 18.5 <= BMI < 25
    const normal = calculateBMI(170, 65);
    expect(normal).toBeGreaterThanOrEqual(18.5);
    expect(normal).toBeLessThan(25);

    // Overweight: BMI >= 25
    const overweight = calculateBMI(170, 80);
    expect(overweight).toBeGreaterThanOrEqual(25);
  });

  it('should return 0 for null or undefined height', () => {
    const bmi = calculateBMI(null as unknown as number, 50);
    expect(bmi).toBe(0);
  });

  it('should return 0 for null or undefined weight', () => {
    const bmi = calculateBMI(170, null as unknown as number);
    expect(bmi).toBe(0);
  });

  it('should return 0 for zero or negative height', () => {
    expect(calculateBMI(0, 50)).toBe(0);
    expect(calculateBMI(-170, 50)).toBe(0);
  });

  it('should return 0 for zero or negative weight', () => {
    expect(calculateBMI(170, 0)).toBe(0);
    expect(calculateBMI(170, -50)).toBe(0);
  });

  it('should handle very tall and heavy person', () => {
    const bmi = calculateBMI(200, 100);
    expect(bmi).toBeGreaterThan(20);
  });

  it('should handle very short and light person', () => {
    const bmi = calculateBMI(140, 40);
    expect(bmi).toBeGreaterThan(0);
  });
});

/* ============================================================================
   FILTER BY BATCH TESTS
   ============================================================================ */

describe('filterStudentsByBatch', () => {
  it('should return students from the specified batch', () => {
    const result = filterStudentsByBatch(mockStudents, 'batch-001');
    expect(result.length).toBe(2);
    expect(result.every((s) => s.batchId === 'batch-001')).toBe(true);
  });

  it('should return empty array for non-existent batch', () => {
    const result = filterStudentsByBatch(mockStudents, 'non-existent-batch');
    expect(result.length).toBe(0);
  });

  it('should return empty array for null batch ID', () => {
    const result = filterStudentsByBatch(mockStudents, null as unknown as string);
    expect(result.length).toBe(0);
  });

  it('should return empty array for empty string batch ID', () => {
    const result = filterStudentsByBatch(mockStudents, '');
    expect(result.length).toBe(0);
  });

  it('should return empty array for null students', () => {
    const result = filterStudentsByBatch(null as unknown as Student[], 'batch-001');
    expect(result.length).toBe(0);
  });

  it('should return empty array for empty students array', () => {
    const result = filterStudentsByBatch([], 'batch-001');
    expect(result.length).toBe(0);
  });

  it('should handle multiple students in same batch', () => {
    const result = filterStudentsByBatch(mockStudents, 'batch-002');
    expect(result.length).toBe(1);
    expect(result[0].fullName).toBe('Rohan Kapoor');
  });
});

/* ============================================================================
   FILTER BY COACH TESTS
   ============================================================================ */

describe('filterStudentsByCoach', () => {
  it('should return students assigned to the specified coach', () => {
    const result = filterStudentsByCoach(mockStudents, 'user-002');
    expect(result.length).toBe(2);
    expect(result.every((s) => s.assignedCoachId === 'user-002')).toBe(true);
  });

  it('should return empty array for non-existent coach', () => {
    const result = filterStudentsByCoach(mockStudents, 'non-existent-coach');
    expect(result.length).toBe(0);
  });

  it('should return empty array for null coach ID', () => {
    const result = filterStudentsByCoach(mockStudents, null as unknown as string);
    expect(result.length).toBe(0);
  });

  it('should return empty array for null students', () => {
    const result = filterStudentsByCoach(null as unknown as Student[], 'user-002');
    expect(result.length).toBe(0);
  });

  it('should handle multiple students assigned to same coach', () => {
    const result = filterStudentsByCoach(mockStudents, 'user-003');
    expect(result.length).toBe(2);
  });
});

/* ============================================================================
   FILTER BY SKILL LEVEL TESTS
   ============================================================================ */

describe('filterStudentsBySkillLevel', () => {
  it('should return students with the specified skill level', () => {
    const result = filterStudentsBySkillLevel(mockStudents, 'Beginner');
    expect(result.length).toBe(1);
    expect(result[0].fullName).toBe('Arjun Verma');
  });

  it('should return multiple students with same skill level', () => {
    const result = filterStudentsBySkillLevel(mockStudents, 'Advanced');
    expect(result.length).toBe(2);
    expect(result.every((s) => s.skillLevel === 'Advanced')).toBe(true);
  });

  it('should return empty array for non-existent skill level', () => {
    const result = filterStudentsBySkillLevel(mockStudents, 'Professional');
    expect(result.length).toBe(0);
  });

  it('should return empty array for null skill level', () => {
    const result = filterStudentsBySkillLevel(mockStudents, null as unknown as 'Beginner');
    expect(result.length).toBe(0);
  });

  it('should return empty array for null students', () => {
    const result = filterStudentsBySkillLevel(null as unknown as Student[], 'Beginner');
    expect(result.length).toBe(0);
  });
});

/* ============================================================================
   FILTER BY MULTIPLE CRITERIA TESTS
   ============================================================================ */

describe('filterStudentsByMultipleCriteria', () => {
  it('should filter by batch only', () => {
    const result = filterStudentsByMultipleCriteria(mockStudents, { batch: 'batch-001' });
    expect(result.length).toBe(2);
    expect(result.every((s) => s.batchId === 'batch-001')).toBe(true);
  });

  it('should filter by coach only', () => {
    const result = filterStudentsByMultipleCriteria(mockStudents, { coach: 'user-002' });
    expect(result.length).toBe(2);
    expect(result.every((s) => s.assignedCoachId === 'user-002')).toBe(true);
  });

  it('should filter by skill level only', () => {
    const result = filterStudentsByMultipleCriteria(mockStudents, { skillLevel: 'Advanced' });
    expect(result.length).toBe(2);
    expect(result.every((s) => s.skillLevel === 'Advanced')).toBe(true);
  });

  it('should filter by search only', () => {
    const result = filterStudentsByMultipleCriteria(mockStudents, { search: 'Arjun' });
    expect(result.length).toBe(1);
    expect(result[0].fullName).toBe('Arjun Verma');
  });

  it('should filter by batch AND coach', () => {
    const result = filterStudentsByMultipleCriteria(mockStudents, {
      batch: 'batch-001',
      coach: 'user-002',
    });
    expect(result.length).toBe(2);
    expect(result.every((s) => s.batchId === 'batch-001' && s.assignedCoachId === 'user-002')).toBe(
      true
    );
  });

  it('should filter by batch AND skill level', () => {
    const result = filterStudentsByMultipleCriteria(mockStudents, {
      batch: 'batch-001',
      skillLevel: 'Beginner',
    });
    expect(result.length).toBe(1);
    expect(result[0].fullName).toBe('Arjun Verma');
  });

  it('should return all students when no filters specified', () => {
    const result = filterStudentsByMultipleCriteria(mockStudents, {});
    expect(result.length).toBe(mockStudents.length);
  });

  it('should return empty array when no criteria match', () => {
    const result = filterStudentsByMultipleCriteria(mockStudents, {
      batch: 'non-existent',
      coach: 'non-existent',
    });
    expect(result.length).toBe(0);
  });

  it('should handle null students', () => {
    const result = filterStudentsByMultipleCriteria(null as unknown as Student[], {});
    expect(result.length).toBe(0);
  });

  it('should handle multiple criteria combined', () => {
    const result = filterStudentsByMultipleCriteria(mockStudents, {
      batch: 'batch-003',
      coach: 'user-003',
      skillLevel: 'Advanced',
      search: 'Sapna',
    });
    expect(result.length).toBe(1);
    expect(result[0].fullName).toBe('Sapna Reddy');
  });
});

/* ============================================================================
   SEARCH STUDENTS TESTS
   ============================================================================ */

describe('searchStudents', () => {
  it('should search by partial name match (case-insensitive)', () => {
    const result = searchStudents(mockStudents, 'arj');
    expect(result.length).toBe(1);
    expect(result[0].fullName).toBe('Arjun Verma');
  });

  it('should search by full name match', () => {
    const result = searchStudents(mockStudents, 'Arjun Verma');
    expect(result.length).toBe(1);
    expect(result[0].fullName).toBe('Arjun Verma');
  });

  it('should search case-insensitively', () => {
    const result1 = searchStudents(mockStudents, 'ARJUN');
    const result2 = searchStudents(mockStudents, 'arjun');
    const result3 = searchStudents(mockStudents, 'Arjun');
    expect(result1.length).toBe(result2.length).toBe(result3.length).toBe(1);
  });

  it('should search by BAID number', () => {
    const result = searchStudents(mockStudents, 'BAID-2026-001');
    expect(result.length).toBe(1);
    expect(result[0].baidNumber).toBe('BAID-2026-001');
  });

  it('should search by partial BAID match', () => {
    const result = searchStudents(mockStudents, 'BAID-2026');
    expect(result.length).toBe(4); // All have BAID starting with BAID-2026
  });

  it('should search by batch ID', () => {
    const result = searchStudents(mockStudents, 'batch-001');
    expect(result.length).toBe(2);
  });

  it('should return all students for empty query', () => {
    const result = searchStudents(mockStudents, '');
    expect(result.length).toBe(mockStudents.length);
  });

  it('should return all students for null query', () => {
    const result = searchStudents(mockStudents, null as unknown as string);
    expect(result.length).toBe(mockStudents.length);
  });

  it('should return empty array for null students', () => {
    const result = searchStudents(null as unknown as Student[], 'arjun');
    expect(result.length).toBe(0);
  });

  it('should return empty array when no match found', () => {
    const result = searchStudents(mockStudents, 'xyz123');
    expect(result.length).toBe(0);
  });

  it('should trim whitespace from query', () => {
    const result1 = searchStudents(mockStudents, '  arjun  ');
    const result2 = searchStudents(mockStudents, 'arjun');
    expect(result1.length).toBe(result2.length).toBe(1);
  });

  it('should handle multiple matches', () => {
    const result = searchStudents(mockStudents, 'a'); // Multiple names start with 'a'
    expect(result.length).toBeGreaterThan(1);
  });
});
