/**
 * Tests for fee utility functions
 */

import { describe, it, expect } from 'vitest';
import { isOverdue, getOverdueFees, getOverdueFeesByStudent, countOverdueFees } from './feeUtils';
import type { FeeRecord, Student } from '../types';

describe('feeUtils', () => {
  const mockFees: FeeRecord[] = [
    {
      id: 'fee-1',
      studentId: 'student-1',
      amount: 3000,
      monthYear: '2025-10',
      dueDate: new Date('2025-10-10'),
      status: 'OVERDUE',
      createdAt: new Date('2025-10-01'),
      updatedAt: new Date('2025-10-20'),
    },
    {
      id: 'fee-2',
      studentId: 'student-2',
      amount: 3000,
      monthYear: '2026-02',
      dueDate: new Date('2027-02-10'),
      status: 'PENDING',
      createdAt: new Date('2026-02-01'),
      updatedAt: new Date('2026-02-01'),
    },
    {
      id: 'fee-3',
      studentId: 'student-1',
      amount: 3000,
      monthYear: '2026-01',
      dueDate: new Date('2026-01-10'),
      paidDate: new Date('2026-01-08'),
      status: 'PAID',
      paymentMethod: 'UPI',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-08'),
    },
  ];

  const mockStudents: Student[] = [
    {
      id: 'student-1',
      fullName: 'Test Student 1',
      dateOfBirth: new Date('2010-01-01'),
      age: 16,
      gender: 'Male',
      contactPhone: '1234567890',
      strengths: [],
      weaknesses: [],
      skillLevel: 'Beginner',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    {
      id: 'student-2',
      fullName: 'Test Student 2',
      dateOfBirth: new Date('2011-01-01'),
      age: 15,
      gender: 'Female',
      contactPhone: '0987654321',
      strengths: [],
      weaknesses: [],
      skillLevel: 'Intermediate',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
  ];

  describe('isOverdue', () => {
    it('should return false for paid fees', () => {
      const paidFee: FeeRecord = {
        ...mockFees[2],
        status: 'PAID',
      };
      expect(isOverdue(paidFee)).toBe(false);
    });

    it('should return false for waived fees', () => {
      const waivedFee: FeeRecord = {
        ...mockFees[0],
        status: 'WAIVED',
      };
      expect(isOverdue(waivedFee)).toBe(false);
    });

    it('should return true for fees past due date', () => {
      const overdueFee: FeeRecord = {
        ...mockFees[0],
        status: 'PENDING',
        dueDate: new Date('2020-01-01'), // Past date
      };
      expect(isOverdue(overdueFee)).toBe(true);
    });

    it('should return false for future due dates', () => {
      const futureFee: FeeRecord = {
        ...mockFees[1],
        status: 'PENDING',
        dueDate: new Date('2030-01-01'), // Future date
      };
      expect(isOverdue(futureFee)).toBe(false);
    });
  });

  describe('getOverdueFees', () => {
    it('should return only overdue fees', () => {
      const result = getOverdueFees(mockFees);
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.every((fee) => fee.status === 'OVERDUE' || isOverdue(fee))).toBe(true);
    });

    it('should not include paid fees', () => {
      const result = getOverdueFees(mockFees);
      expect(result.every((fee) => fee.status !== 'PAID')).toBe(true);
    });
  });

  describe('getOverdueFeesByStudent', () => {
    it('should group overdue fees by student', () => {
      const result = getOverdueFeesByStudent(mockFees, mockStudents);
      expect(Array.isArray(result)).toBe(true);
      result.forEach((item) => {
        expect(item).toHaveProperty('student');
        expect(item).toHaveProperty('overdueFees');
        expect(item).toHaveProperty('totalOverdue');
      });
    });

    it('should calculate total overdue correctly', () => {
      const result = getOverdueFeesByStudent(mockFees, mockStudents);
      result.forEach((item) => {
        const expectedTotal = item.overdueFees.reduce((sum, fee) => sum + fee.amount, 0);
        expect(item.totalOverdue).toBe(expectedTotal);
      });
    });

    it('should sort by total overdue amount descending', () => {
      const result = getOverdueFeesByStudent(mockFees, mockStudents);
      for (let i = 1; i < result.length; i++) {
        expect(result[i - 1].totalOverdue).toBeGreaterThanOrEqual(result[i].totalOverdue);
      }
    });
  });

  describe('countOverdueFees', () => {
    it('should return count of overdue fees', () => {
      const count = countOverdueFees(mockFees);
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('should match length of getOverdueFees result', () => {
      const count = countOverdueFees(mockFees);
      const overdueFees = getOverdueFees(mockFees);
      expect(count).toBe(overdueFees.length);
    });
  });
});
