/**
 * Fee utility functions
 * Helper functions for fee calculations and status checks
 */

import type { FeeRecord, Student } from '../types';

/**
 * Check if a fee record is overdue
 */
export function isOverdue(fee: FeeRecord): boolean {
  if (fee.status === 'PAID' || fee.status === 'WAIVED') {
    return false;
  }
  
  const today = new Date();
  const dueDate = new Date(fee.dueDate);
  return today > dueDate;
}

/**
 * Get all overdue fees
 */
export function getOverdueFees(fees: FeeRecord[]): FeeRecord[] {
  return fees.filter((fee) => 
    fee.status === 'OVERDUE' || 
    (fee.status === 'PENDING' && isOverdue(fee))
  );
}

/**
 * Get overdue fees grouped by student
 */
export function getOverdueFeesByStudent(
  fees: FeeRecord[],
  students: Student[]
): Array<{ student: Student; overdueFees: FeeRecord[]; totalOverdue: number }> {
  const overdueFees = getOverdueFees(fees);
  
  // Group fees by student
  const feesByStudent = new Map<string, FeeRecord[]>();
  overdueFees.forEach((fee) => {
    const existing = feesByStudent.get(fee.studentId) || [];
    feesByStudent.set(fee.studentId, [...existing, fee]);
  });
  
  // Map to student objects with totals
  const result: Array<{ student: Student; overdueFees: FeeRecord[]; totalOverdue: number }> = [];
  
  feesByStudent.forEach((fees, studentId) => {
    const student = students.find((s) => s.id === studentId);
    if (student) {
      const totalOverdue = fees.reduce((sum, fee) => sum + fee.amount, 0);
      result.push({
        student,
        overdueFees: fees,
        totalOverdue,
      });
    }
  });
  
  // Sort by total overdue amount (descending)
  return result.sort((a, b) => b.totalOverdue - a.totalOverdue);
}

/**
 * Count overdue fees
 */
export function countOverdueFees(fees: FeeRecord[]): number {
  return getOverdueFees(fees).length;
}
