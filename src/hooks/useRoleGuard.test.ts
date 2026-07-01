import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRoleGuard } from './useRoleGuard';
import type { UserRole } from '../types';

// Mock the dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

describe('useRoleGuard', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
  });

  it('should not redirect when user role is in allowed roles', () => {
    // Mock HEAD_COACH role
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      role: 'HEAD_COACH' as UserRole,
      user: { id: '1', name: 'Test Coach', role: 'HEAD_COACH' },
      token: 'test-token',
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderHook(() => useRoleGuard(['HEAD_COACH']));

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should redirect when user role is not in allowed roles', () => {
    // Mock ASSISTANT_COACH role trying to access HEAD_COACH only page
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      role: 'ASSISTANT_COACH' as UserRole,
      user: { id: '2', name: 'Test Assistant', role: 'ASSISTANT_COACH' },
      token: 'test-token',
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderHook(() => useRoleGuard(['HEAD_COACH']));

    expect(mockNavigate).toHaveBeenCalledWith('/access-denied', { replace: true });
  });

  it('should allow access when user role is in list of multiple allowed roles', () => {
    // Mock ASSISTANT_COACH role accessing page allowed for both HEAD_COACH and ASSISTANT_COACH
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      role: 'ASSISTANT_COACH' as UserRole,
      user: { id: '2', name: 'Test Assistant', role: 'ASSISTANT_COACH' },
      token: 'test-token',
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderHook(() => useRoleGuard(['HEAD_COACH', 'ASSISTANT_COACH']));

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should redirect STUDENT trying to access coach pages', () => {
    // Mock STUDENT role trying to access coach page
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      role: 'STUDENT' as UserRole,
      user: { id: '3', name: 'Test Student', role: 'STUDENT' },
      token: 'test-token',
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderHook(() => useRoleGuard(['HEAD_COACH', 'ASSISTANT_COACH']));

    expect(mockNavigate).toHaveBeenCalledWith('/access-denied', { replace: true });
  });

  it('should not redirect when role is null', () => {
    // Mock null role (not authenticated or loading)
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      role: null,
      user: null,
      token: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderHook(() => useRoleGuard(['HEAD_COACH']));

    // Should not navigate when role is null (let auth handle it)
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
