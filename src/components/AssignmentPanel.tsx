import React, { useState } from 'react';
import type { User, Student, Batch } from '../types';

/**
 * AssignmentPanel Component
 * Manages coach assignments to batches and individual students
 * 
 * Requirements: 15.6, 15.7, 15.8, 15.9
 * 
 * Features:
 * - Display current batch and student assignments for selected coach
 * - Assign coach to batches (automatically assigns to all students in batch)
 * - Assign coach to individual students
 * - Unassign coach from batches or students
 * - Updates students.json with assignedCoachId changes
 */

interface AssignmentPanelProps {
  selectedCoach: User | null;
  students: Student[];
  batches: Batch[];
  onAssignmentChange: (updatedStudents: Student[], updatedBatches: Batch[]) => void;
}

export const AssignmentPanel: React.FC<AssignmentPanelProps> = ({
  selectedCoach,
  students,
  batches,
  onAssignmentChange,
}) => {
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  if (!selectedCoach) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <p className="mt-4 text-sm">Select a coach to manage assignments</p>
        </div>
      </div>
    );
  }

  // Get assigned batches for this coach
  const assignedBatches = batches.filter((batch) => batch.assignedCoachId === selectedCoach.id);

  // Get assigned students (individual assignments, not via batch)
  const assignedStudents = students.filter(
    (student) => student.assignedCoachId === selectedCoach.id
  );

  // Get unassigned batches
  const unassignedBatches = batches.filter((batch) => !batch.assignedCoachId);

  // Get unassigned students
  const unassignedStudents = students.filter((student) => !student.assignedCoachId);

  // Handle batch assignment
  const handleAssignBatch = () => {
    if (!selectedBatchId) return;

    const batch = batches.find((b) => b.id === selectedBatchId);
    if (!batch) return;

    // Update batch with coach assignment
    const updatedBatches = batches.map((b) =>
      b.id === selectedBatchId ? { ...b, assignedCoachId: selectedCoach.id } : b
    );

    // Update all students in this batch with coach assignment
    const updatedStudents = students.map((student) =>
      student.batchId === selectedBatchId
        ? { ...student, assignedCoachId: selectedCoach.id }
        : student
    );

    onAssignmentChange(updatedStudents, updatedBatches);
    setSelectedBatchId('');
  };

  // Handle individual student assignment
  const handleAssignStudent = () => {
    if (!selectedStudentId) return;

    const updatedStudents = students.map((student) =>
      student.id === selectedStudentId
        ? { ...student, assignedCoachId: selectedCoach.id }
        : student
    );

    onAssignmentChange(updatedStudents, batches);
    setSelectedStudentId('');
  };

  // Handle batch unassignment
  const handleUnassignBatch = (batchId: string) => {
    // Update batch to remove coach assignment
    const updatedBatches = batches.map((b) =>
      b.id === batchId ? { ...b, assignedCoachId: undefined } : b
    );

    // Update all students in this batch to remove coach assignment
    const updatedStudents = students.map((student) =>
      student.batchId === batchId && student.assignedCoachId === selectedCoach.id
        ? { ...student, assignedCoachId: undefined }
        : student
    );

    onAssignmentChange(updatedStudents, updatedBatches);
  };

  // Handle individual student unassignment
  const handleUnassignStudent = (studentId: string) => {
    const updatedStudents = students.map((student) =>
      student.id === studentId ? { ...student, assignedCoachId: undefined } : student
    );

    onAssignmentChange(updatedStudents, batches);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Assignments for {selectedCoach.name}
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage batch and student assignments for this coach
        </p>
      </div>

      {/* Assign Batch Section */}
      <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Assign to Batch
        </h3>
        <div className="flex gap-3">
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select a batch...</option>
            {unassignedBatches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.name} ({batch.schedule})
              </option>
            ))}
          </select>
          <button
            onClick={handleAssignBatch}
            disabled={!selectedBatchId}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-gray-900 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Assign
          </button>
        </div>
        {unassignedBatches.length === 0 && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            All batches are currently assigned
          </p>
        )}
      </div>

      {/* Assign Individual Student Section */}
      <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Assign Individual Student
        </h3>
        <div className="flex gap-3">
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select a student...</option>
            {unassignedStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {student.fullName} - {student.skillLevel}
              </option>
            ))}
          </select>
          <button
            onClick={handleAssignStudent}
            disabled={!selectedStudentId}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-gray-900 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Assign
          </button>
        </div>
        {unassignedStudents.length === 0 && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            All students are currently assigned
          </p>
        )}
      </div>

      {/* Current Assignments Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Current Assignments
        </h3>

        {/* Assigned Batches */}
        {assignedBatches.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
              Batches ({assignedBatches.length})
            </h4>
            <div className="space-y-2">
              {assignedBatches.map((batch) => {
                const studentsInBatch = students.filter((s) => s.batchId === batch.id);
                return (
                  <div
                    key={batch.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {batch.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {batch.schedule} • {studentsInBatch.length} students
                      </p>
                    </div>
                    <button
                      onClick={() => handleUnassignBatch(batch.id)}
                      className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      Unassign
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Assigned Students */}
        {assignedStudents.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
              Individual Students ({assignedStudents.length})
            </h4>
            <div className="space-y-2">
              {assignedStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {student.fullName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {student.skillLevel} • {student.batchId ? `Batch: ${student.batchId}` : 'No batch'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleUnassignStudent(student.id)}
                    className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  >
                    Unassign
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Assignments State */}
        {assignedBatches.length === 0 && assignedStudents.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-sm">No assignments yet</p>
            <p className="text-xs mt-1">Use the forms above to assign batches or students</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentPanel;
