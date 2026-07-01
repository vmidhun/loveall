/**
 * CoachWorkload Component
 * Displays coach workload statistics with visual indicators
 */

import React from 'react';
import type { CoachWorkload as CoachWorkloadType } from '../utils/activityUtils';

interface CoachWorkloadProps {
  workloads: CoachWorkloadType[];
}

export const CoachWorkload: React.FC<CoachWorkloadProps> = ({ workloads }) => {
  if (workloads.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Coach Workloads
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          No coach assignments found.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Coach Workloads
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Student assignments per coach
      </p>

      <div className="space-y-3">
        {workloads.map((workload) => {
          const getStatusColor = () => {
            if (workload.isOverloaded) return 'red';
            if (workload.isBalanced) return 'green';
            if (workload.isUnderloaded) return 'yellow';
            return 'slate';
          };

          const getStatusLabel = () => {
            if (workload.isOverloaded) return 'Overloaded';
            if (workload.isBalanced) return 'Balanced';
            if (workload.isUnderloaded) return 'Light';
            if (workload.studentCount === 0) return 'No assignments';
            return '';
          };

          const statusColor = getStatusColor();
          const statusLabel = getStatusLabel();

          return (
            <div
              key={workload.coachId}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full ${
                    statusColor === 'red'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      : statusColor === 'green'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : statusColor === 'yellow'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  } flex items-center justify-center text-xs font-semibold`}
                >
                  {workload.studentCount}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                    {workload.coachName}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {workload.studentCount} student{workload.studentCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              {statusLabel && (
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    statusColor === 'red'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      : statusColor === 'green'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : statusColor === 'yellow'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {statusLabel}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>Balanced (5-10)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            <span>Light (&lt;5)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Overloaded (&gt;10)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachWorkload;
