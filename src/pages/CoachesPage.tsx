import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import CoachListTable from '../components/CoachListTable';
import AddCoachModal, { type CoachFormData } from '../components/AddCoachModal';
import AssignmentPanel from '../components/AssignmentPanel';
import { useRoleGuard } from '../hooks/useRoleGuard';
import type { User, Student, Batch } from '../types';

/**
 * CoachManagementPage (CoachesPage)
 * Manages assistant coaches - accessible only to Head Coach
 * 
 * Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8, 15.9
 * 
 * Features:
 * - Displays list of assistant coaches
 * - Shows assignment statistics (batches, students)
 * - Shows last active timestamp
 * - Add assistant coach functionality with modal form
 * - Coach selection for assignment management
 * - AssignmentPanel for managing batch and student assignments
 * - Enforces Head Coach-only access via useRoleGuard
 */

export const CoachesPage: React.FC = () => {
  // Enforce Head Coach-only access
  useRoleGuard(['HEAD_COACH']);

  const [coaches, setCoaches] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<User | null>(null);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load users (coaches)
        const usersResponse = await fetch('/src/data/users.json');
        const usersData = (await usersResponse.json()) as User[];
        
        // Convert date strings to Date objects
        const parsedUsers = usersData.map((user) => ({
          ...user,
          createdAt: new Date(user.createdAt),
          lastActive: new Date(user.lastActive),
        }));
        
        setCoaches(parsedUsers);

        // Load students
        const studentsResponse = await fetch('/src/data/students.json');
        const studentsData = (await studentsResponse.json()) as Student[];
        
        // Convert date strings to Date objects
        const parsedStudents = studentsData.map((student) => ({
          ...student,
          dateOfBirth: new Date(student.dateOfBirth),
          createdAt: new Date(student.createdAt),
          updatedAt: new Date(student.updatedAt),
        }));
        
        setStudents(parsedStudents);

        // Load batches (if available)
        try {
          const batchesResponse = await fetch('/src/data/batches.json');
          if (batchesResponse.ok) {
            const batchesData = (await batchesResponse.json()) as Batch[];
            const parsedBatches = batchesData.map((batch) => ({
              ...batch,
              createdAt: new Date(batch.createdAt),
            }));
            setBatches(parsedBatches);
          }
        } catch {
          // Batches file might not exist yet - that's okay
          setBatches([]);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load coach data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Generate unique ID for new coach
  const generateCoachId = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `user-${timestamp}-${random}`;
  };

  // Handle add coach submission
  const handleAddCoach = async (coachData: CoachFormData) => {
    try {
      // Create new coach object
      const newCoach: User = {
        id: generateCoachId(),
        username: coachData.username,
        role: 'ASSISTANT_COACH',
        name: coachData.name,
        email: coachData.email || undefined,
        profilePhoto: coachData.profilePhoto || undefined,
        specialization: coachData.specialization || undefined,
        createdAt: new Date(),
        lastActive: new Date(),
      };

      // Load current coaches from localStorage/JSON
      const storedCoaches = localStorage.getItem('coaches');
      let coachesData: User[];

      if (storedCoaches) {
        coachesData = JSON.parse(storedCoaches);
      } else {
        // Load from JSON file if not in localStorage
        const response = await fetch('/src/data/users.json');
        coachesData = await response.json();
      }

      // Add new coach
      coachesData.push(newCoach);

      // Save to localStorage (simulating JSON update)
      localStorage.setItem('coaches', JSON.stringify(coachesData));

      // Update state with new coach
      setCoaches((prevCoaches) => [...prevCoaches, newCoach]);

      // Close modal
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Error adding coach:', err);
      throw new Error('Failed to add coach. Please try again.');
    }
  };

  // Handle assignment changes
  const handleAssignmentChange = async (updatedStudents: Student[], updatedBatches: Batch[]) => {
    try {
      // Update students state
      setStudents(updatedStudents);
      
      // Update batches state
      setBatches(updatedBatches);
      
      // Save students to localStorage (simulating JSON update)
      const studentsForStorage = updatedStudents.map((student) => ({
        ...student,
        dateOfBirth: student.dateOfBirth.toISOString(),
        createdAt: student.createdAt.toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      localStorage.setItem('students', JSON.stringify(studentsForStorage));
      
      // Save batches to localStorage
      const batchesForStorage = updatedBatches.map((batch) => ({
        ...batch,
        createdAt: batch.createdAt.toISOString(),
      }));
      localStorage.setItem('batches', JSON.stringify(batchesForStorage));
    } catch (err) {
      console.error('Error updating assignments:', err);
      setError('Failed to update assignments. Please try again.');
    }
  };

  // Handle coach selection
  const handleCoachSelect = (coach: User) => {
    setSelectedCoach(coach.id === selectedCoach?.id ? null : coach);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Coach Management
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              View and manage assistant coaches and their assignments
            </p>
          </div>
          
          {/* Add Coach Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-gray-900 font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
            Add Assistant Coach
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Coach List Table */}
        {!loading && !error && (
          <div className="mb-6">
            <CoachListTable 
              coaches={coaches} 
              students={students} 
              batches={batches}
              selectedCoachId={selectedCoach?.id}
              onCoachSelect={handleCoachSelect}
            />
          </div>
        )}

        {/* Assignment Panel */}
        {!loading && !error && (
          <AssignmentPanel
            selectedCoach={selectedCoach}
            students={students}
            batches={batches}
            onAssignmentChange={handleAssignmentChange}
          />
        )}

        {/* Add Coach Modal */}
        <AddCoachModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddCoach}
        />
      </div>
    </DashboardLayout>
  );
};

export default CoachesPage;
