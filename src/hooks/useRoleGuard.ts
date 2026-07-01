import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types';

/**
 * useRoleGuard Hook
 * Enforces role-based access control by redirecting unauthorized users
 * 
 * Requirements: 15.1, 15.2
 * 
 * @param allowedRoles - Array of roles that can access the current page
 * 
 * @example
 * // In a Head Coach-only page
 * useRoleGuard(['HEAD_COACH']);
 * 
 * // In a page accessible by Head Coach and Assistant Coach
 * useRoleGuard(['HEAD_COACH', 'ASSISTANT_COACH']);
 */
export const useRoleGuard = (allowedRoles: UserRole[]): void => {
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if current user role is in the allowed roles list
    if (role && !allowedRoles.includes(role)) {
      // Redirect to access-denied page if not authorized
      navigate('/access-denied', { replace: true });
    }
  }, [role, allowedRoles, navigate]);
};
