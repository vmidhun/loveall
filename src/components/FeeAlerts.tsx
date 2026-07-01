/**
 * FeeAlerts Component
 * Displays overdue fee alerts with student list
 */

import React from 'react';
import type { Student, FeeRecord } from '../types';

interface FeeAlertsProps {
  overdueFees: Array<{
    student: Student;
    overdueFees: FeeRecord[];
    totalOverdue: number;
  }>;
  onViewDetails?: () => void;
}

export const FeeAlerts: React.FC<FeeAlertsProps> = ({ overdueFees, onViewDetails }) => {
  const totalOverdueCount = overdueFees.reduce(
    (sum, item) => sum + item.overdueFees.length,
    0
  );

  if (overdueFees.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Fee Alerts
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              All fees are up to date! No overdue payments.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-red-900 dark:text-red-100">
              Fee Alerts
            </h3>
            <span className="text-sm font-medium text-red-700 dark:text-red-300">
              {totalOverdueCount} overdue payment{totalOverdueCount !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">
            {overdueFees.length} student{overdueFees.length !== 1 ? 's have' : ' has'} overdue fees
          </p>

          {/* Student list */}
          <div className="mt-4 space-y-2">
            {overdueFees.slice(0, 5).map(({ student, overdueFees: fees, totalOverdue }) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {student.fullName}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {fees.length} overdue payment{fees.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                    ₹{totalOverdue.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {overdueFees.length > 5 && (
            <p className="mt-3 text-xs text-red-700 dark:text-red-300">
              +{overdueFees.length - 5} more student{overdueFees.length - 5 !== 1 ? 's' : ''} with
              overdue fees
            </p>
          )}

          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="mt-4 text-sm font-medium text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 underline"
            >
              View all fee details →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeeAlerts;
