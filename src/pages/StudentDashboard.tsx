import React, { useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import type { FeeRecord, FeeStatus, CurriculumPlan, WeekPlan } from '../types';
import { computeAllFeeStatuses } from '../utils/feeUtils';
import { generateCycleKey } from '../utils/skillUtils';
import { getCurrentWeekInCycle } from '../utils/dateUtils';
import feesData from '../data/fees.json';
import curriculumData from '../data/curriculum.json';

/**
 * StudentDashboard Page
 * Displays student dashboard with personal stats, fee history, and current week curriculum
 * Requirements: 14.1, 14.2, 14.3, 14.4, 21.1, 21.2, 21.3, 21.4, 21.5
 */

// Mapping of user IDs to student IDs
// In Phase 7, this will be handled by the backend API
const USER_TO_STUDENT_MAP: Record<string, string> = {
  'user-004': 'student-001',
  'user-005': 'student-002',
};

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  // Get the student ID for the current user
  const studentId = user?.id ? USER_TO_STUDENT_MAP[user.id] : null;

  // Get current cycle key and week number
  const currentCycleKey = useMemo(() => generateCycleKey(), []);
  const currentWeekNumber = useMemo(() => getCurrentWeekInCycle(), []);

  // Load student's curriculum plan for current cycle
  const currentCurriculumPlan = useMemo(() => {
    if (!studentId) return null;

    // Load curriculum plans from JSON and convert date strings
    const plans = curriculumData.map((plan) => ({
      ...plan,
      createdAt: new Date(plan.createdAt),
      updatedAt: new Date(plan.updatedAt),
      batchId: plan.batchId || undefined,
      studentId: plan.studentId || undefined,
      sourceBatchPlanId: plan.sourceBatchPlanId || undefined,
    })) as CurriculumPlan[];

    // Find the student's individual plan for the current cycle
    const studentPlan = plans.find(
      (plan) =>
        plan.studentId === studentId &&
        plan.cycleKey === currentCycleKey &&
        !plan.isArchived
    );

    return studentPlan || null;
  }, [studentId, currentCycleKey]);

  // Get the current week's plan
  const currentWeekPlan = useMemo<WeekPlan | null>(() => {
    if (!currentCurriculumPlan) return null;

    return (
      currentCurriculumPlan.weeks.find(
        (week) => week.weekNumber === currentWeekNumber
      ) || null
    );
  }, [currentCurriculumPlan, currentWeekNumber]);

  // Load and filter fees for the current student
  const studentFees = useMemo(() => {
    if (!studentId) return [];

    // Load fees from JSON and convert date strings to Date objects
    const rawFees = feesData.map((fee) => ({
      ...fee,
      dueDate: new Date(fee.dueDate),
      paidDate: fee.paidDate ? new Date(fee.paidDate) : undefined,
      createdAt: new Date(fee.createdAt),
      updatedAt: new Date(fee.updatedAt),
    })) as FeeRecord[];

    // Filter fees by student ID
    const filtered = rawFees.filter((fee) => fee.studentId === studentId);

    // Compute current statuses (auto-detect OVERDUE)
    const withStatuses = computeAllFeeStatuses(filtered);

    // Sort in reverse chronological order (most recent first)
    return withStatuses.sort((a, b) => {
      const dateA = new Date(a.monthYear).getTime();
      const dateB = new Date(b.monthYear).getTime();
      return dateB - dateA;
    });
  }, [studentId]);

  // Calculate total outstanding balance (PENDING + OVERDUE)
  const outstandingBalance = useMemo(() => {
    return studentFees
      .filter((fee) => fee.status === 'PENDING' || fee.status === 'OVERDUE')
      .reduce((sum, fee) => sum + fee.amount, 0);
  }, [studentFees]);

  // Get status badge classes
  const getStatusBadgeClasses = (status: FeeStatus): string => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'WAIVED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Format date
  const formatDate = (date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Format month/year for display
  const formatMonthYear = (monthYear: string): string => {
    const [year, month] = monthYear.split('-');
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  if (!user || !studentId) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <p className="text-gray-500 dark:text-gray-400">Unable to load student data</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {user.name}
          </p>
        </div>

        {/* Current Week Curriculum Section */}
        {currentWeekPlan && (
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-lg shadow-md p-6 border-l-4 border-primary">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Week {currentWeekNumber} Training Focus
                </h2>
                <span className="bg-primary text-slate-900 px-3 py-1 rounded-full text-sm font-semibold">
                  Current Week
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentCycleKey}
              </p>
            </div>

            {/* Focus Area */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Focus Area
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-base">
                {currentWeekPlan.focusArea}
              </p>
            </div>

            {/* Training Objective */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                This Week's Objective
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-base">
                {currentWeekPlan.objective}
              </p>
            </div>

            {/* Drills */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Assigned Drills
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {currentWeekPlan.drills.map((drill) => (
                  <div
                    key={drill.id}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                        {drill.name}
                      </h4>
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-medium">
                        {drill.category}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {drill.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No Curriculum Message */}
        {!currentWeekPlan && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center border-l-4 border-gray-300 dark:border-gray-600">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Curriculum Plan Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your coach hasn't assigned a training plan for this cycle yet.
            </p>
          </div>
        )}

        {/* Outstanding Balance Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Outstanding Balance
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {formatCurrency(outstandingBalance)}
              </p>
            </div>
            {outstandingBalance > 0 && (
              <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium">
                Payment Due
              </div>
            )}
            {outstandingBalance === 0 && (
              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                All Paid
              </div>
            )}
          </div>
        </div>

        {/* Fee History Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Fee History
          </h2>

          {studentFees.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No fee records found</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Month/Year
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Paid Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {studentFees.map((fee) => (
                      <tr key={fee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatMonthYear(fee.monthYear)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-medium">
                          {formatCurrency(fee.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClasses(fee.status)}`}
                          >
                            {fee.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {fee.paidDate ? formatDate(fee.paidDate) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
