/**
 * FeesPage Integration Tests
 * Tests overdue fee auto-detection, stats computation, and data refresh
 * Requirements: 12.1, 12.2, 12.3, 12.4
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import FeesPage from './FeesPage';

// Mock the data files
vi.mock('../data/fees.json', () => ({
  default: [
    {
      id: 'fee-001',
      studentId: 'student-001',
      amount: 3000,
      monthYear: '2026-01',
      dueDate: '2026-01-10T00:00:00.000Z',
      paidDate: '2026-01-08T00:00:00.000Z',
      status: 'PAID',
      paymentMethod: 'UPI',
      transactionRef: 'UPI-2026010801234',
      notes: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-08T00:00:00.000Z',
    },
    {
      id: 'fee-002',
      studentId: 'student-002',
      amount: 3000,
      monthYear: '2025-11',
      dueDate: '2025-11-10T00:00:00.000Z',
      paidDate: null,
      status: 'PENDING',
      paymentMethod: null,
      transactionRef: null,
      notes: 'Should be auto-detected as OVERDUE',
      createdAt: '2025-11-01T00:00:00.000Z',
      updatedAt: '2025-11-12T00:00:00.000Z',
    },
    {
      id: 'fee-003',
      studentId: 'student-003',
      amount: 3500,
      monthYear: '2025-12',
      dueDate: '2025-12-10T00:00:00.000Z',
      paidDate: null,
      status: 'PENDING',
      paymentMethod: null,
      transactionRef: null,
      notes: 'Should be auto-detected as OVERDUE',
      createdAt: '2025-12-01T00:00:00.000Z',
      updatedAt: '2025-12-15T00:00:00.000Z',
    },
    {
      id: 'fee-004',
      studentId: 'student-004',
      amount: 3000,
      monthYear: '2027-02',
      dueDate: '2027-02-10T00:00:00.000Z',
      paidDate: null,
      status: 'PENDING',
      paymentMethod: null,
      transactionRef: null,
      notes: 'Future fee - should remain PENDING',
      createdAt: '2026-02-01T00:00:00.000Z',
      updatedAt: '2026-02-01T00:00:00.000Z',
    },
    {
      id: 'fee-005',
      studentId: 'student-005',
      amount: 3000,
      monthYear: '2025-10',
      dueDate: '2025-10-10T00:00:00.000Z',
      paidDate: null,
      status: 'OVERDUE',
      paymentMethod: null,
      transactionRef: null,
      notes: 'Explicitly marked OVERDUE',
      createdAt: '2025-10-01T00:00:00.000Z',
      updatedAt: '2025-10-20T00:00:00.000Z',
    },
  ],
}));

vi.mock('../data/students.json', () => ({
  default: [
    {
      id: 'student-001',
      fullName: 'John Doe',
      dateOfBirth: '2010-01-01T00:00:00.000Z',
      age: 14,
      gender: 'Male',
      contactPhone: '1234567890',
      batchId: 'batch-001',
      strengths: [],
      weaknesses: [],
      skillLevel: 'Beginner',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'student-002',
      fullName: 'Jane Smith',
      dateOfBirth: '2011-01-01T00:00:00.000Z',
      age: 13,
      gender: 'Female',
      contactPhone: '0987654321',
      batchId: 'batch-002',
      strengths: [],
      weaknesses: [],
      skillLevel: 'Intermediate',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'student-003',
      fullName: 'Alice Johnson',
      dateOfBirth: '2012-01-01T00:00:00.000Z',
      age: 12,
      gender: 'Female',
      contactPhone: '1112223333',
      batchId: 'batch-001',
      strengths: [],
      weaknesses: [],
      skillLevel: 'Beginner',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'student-004',
      fullName: 'Bob Wilson',
      dateOfBirth: '2013-01-01T00:00:00.000Z',
      age: 11,
      gender: 'Male',
      contactPhone: '4445556666',
      batchId: 'batch-002',
      strengths: [],
      weaknesses: [],
      skillLevel: 'Beginner',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'student-005',
      fullName: 'Charlie Brown',
      dateOfBirth: '2009-01-01T00:00:00.000Z',
      age: 15,
      gender: 'Male',
      contactPhone: '7778889999',
      batchId: 'batch-001',
      strengths: [],
      weaknesses: [],
      skillLevel: 'Intermediate',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  ],
}));

const renderFeesPage = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <FeesPage />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('FeesPage - Overdue Fee Auto-Detection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display the fee management page', async () => {
    renderFeesPage();

    await waitFor(() => {
      expect(screen.getByText('Fee Management')).toBeInTheDocument();
    });
  });

  it('should automatically detect and count overdue fees on page load (Requirement 12.1, 12.2)', async () => {
    renderFeesPage();

    await waitFor(() => {
      // The overdue count stat card should display 3 overdue fees:
      // - fee-002 (PENDING, due 2025-11-10) -> auto-detected as OVERDUE
      // - fee-003 (PENDING, due 2025-12-10) -> auto-detected as OVERDUE
      // - fee-005 (explicitly OVERDUE)
      const overdueCountElement = screen.getByText('Overdue Fees')
        .closest('div')
        ?.querySelector('.text-3xl');

      expect(overdueCountElement).toHaveTextContent('3');
    });
  });

  it('should display overdue fees with red indicator in the fee list (Requirement 12.3)', async () => {
    renderFeesPage();

    await waitFor(() => {
      // Get all OVERDUE status badges
      const overdueBadges = screen.getAllByText('OVERDUE');

      // Should have 3 OVERDUE badges
      expect(overdueBadges).toHaveLength(3);

      // Check that all overdue badges have red background
      overdueBadges.forEach((badge) => {
        expect(badge.className).toContain('bg-red-100');
        expect(badge.className).toContain('text-red-800');
      });
    });
  });

  it('should keep PENDING fees with future due dates as PENDING', async () => {
    renderFeesPage();

    await waitFor(() => {
      // fee-004 has a future due date (2027-02-10) and should remain PENDING
      const pendingBadges = screen.getAllByText('PENDING');

      // Should have exactly 1 PENDING fee (fee-004)
      expect(pendingBadges).toHaveLength(1);

      // Check that pending badge has yellow background
      expect(pendingBadges[0].className).toContain('bg-yellow-100');
    });
  });

  it('should calculate outstanding balance including overdue fees', async () => {
    renderFeesPage();

    await waitFor(() => {
      // Outstanding balance should include:
      // - fee-002: 3000 (auto-detected OVERDUE)
      // - fee-003: 3500 (auto-detected OVERDUE)
      // - fee-004: 3000 (PENDING)
      // - fee-005: 3000 (explicitly OVERDUE)
      // Total: 12500
      const outstandingElement = screen.getByText('Outstanding Balance')
        .closest('div')
        ?.querySelector('.text-3xl');

      expect(outstandingElement).toHaveTextContent('₹12,500');
    });
  });

  it('should allow filtering by OVERDUE status', async () => {
    renderFeesPage();

    await waitFor(() => {
      // Find the filter dropdown
      const filterDropdown = screen.getByLabelText('Filter by Status:') as HTMLSelectElement;

      // Change filter to OVERDUE
      filterDropdown.value = 'OVERDUE';
      filterDropdown.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await waitFor(() => {
      // Should show 3 fees when filtered by OVERDUE
      expect(screen.getByText(/Showing 3 of 5 fees/)).toBeInTheDocument();

      // Should only show OVERDUE badges
      const overdueBadges = screen.getAllByText('OVERDUE');
      expect(overdueBadges).toHaveLength(3);

      // Should not show PAID or PENDING badges
      expect(screen.queryByText('PAID')).not.toBeInTheDocument();
      expect(screen.queryByText('PENDING')).not.toBeInTheDocument();
    });
  });

  it('should show action buttons for overdue fees (Requirement 12.4)', async () => {
    renderFeesPage();

    await waitFor(() => {
      // OVERDUE fees should have "Mark Paid" and "Waive" buttons
      const markPaidButtons = screen.getAllByText('Mark Paid');
      const waiveButtons = screen.getAllByText('Waive');

      // Should have 4 "Mark Paid" buttons (3 OVERDUE + 1 PENDING)
      expect(markPaidButtons).toHaveLength(4);

      // Should have 4 "Waive" buttons (3 OVERDUE + 1 PENDING)
      expect(waiveButtons).toHaveLength(4);
    });
  });

  it('should display fee stats with correct color coding (Requirement 10.2)', async () => {
    renderFeesPage();

    await waitFor(() => {
      // Find the parent stat cards (the colored divs with padding)
      const collectedCard = screen.getByText('Collected This Month').closest('.p-6');
      const outstandingCard = screen.getByText('Outstanding Balance').closest('.p-6');
      const overdueCard = screen.getByText('Overdue Fees').closest('.p-6');

      // Check color coding - cards should have the correct background colors
      expect(collectedCard).toBeTruthy();
      expect(outstandingCard).toBeTruthy();
      expect(overdueCard).toBeTruthy();

      // Verify the color classes are present in the className
      const collectedClasses = collectedCard?.className || '';
      const outstandingClasses = outstandingCard?.className || '';
      const overdueClasses = overdueCard?.className || '';

      expect(collectedClasses).toMatch(/bg-green-/); // Green for collected
      expect(outstandingClasses).toMatch(/bg-yellow-/); // Yellow for outstanding
      expect(overdueClasses).toMatch(/bg-red-/); // Red for overdue
    });
  });
});
