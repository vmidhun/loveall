/**
 * Date Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import {
  getCurrentWeekInCycle,
  getWeekStartDate,
  formatDateRange,
  formatAuditTimestamp,
} from './dateUtils';

describe('dateUtils', () => {
  describe('getCurrentWeekInCycle', () => {
    it('returns week 1 for first week of first month (Jan 1-7)', () => {
      const date = new Date('2026-01-05');
      expect(getCurrentWeekInCycle(date)).toBe(1);
    });

    it('returns week 2 for second week of first month (Jan 8-15)', () => {
      const date = new Date('2026-01-10');
      expect(getCurrentWeekInCycle(date)).toBe(2);
    });

    it('returns week 3 for third week of first month (Jan 16-23)', () => {
      const date = new Date('2026-01-20');
      expect(getCurrentWeekInCycle(date)).toBe(3);
    });

    it('returns week 4 for fourth week of first month (Jan 24-31)', () => {
      const date = new Date('2026-01-30');
      expect(getCurrentWeekInCycle(date)).toBe(4);
    });

    it('returns week 5 for first week of second month (Feb 1-7)', () => {
      const date = new Date('2026-02-05');
      expect(getCurrentWeekInCycle(date)).toBe(5);
    });

    it('returns week 6 for second week of second month (Feb 8-14)', () => {
      const date = new Date('2026-02-10');
      expect(getCurrentWeekInCycle(date)).toBe(6);
    });

    it('returns week 7 for third week of second month (Feb 15-21)', () => {
      const date = new Date('2026-02-18');
      expect(getCurrentWeekInCycle(date)).toBe(7);
    });

    it('returns week 8 for fourth week of second month (Feb 22+)', () => {
      const date = new Date('2026-02-25');
      expect(getCurrentWeekInCycle(date)).toBe(8);
    });
  });

  describe('getWeekStartDate', () => {
    it('returns correct start date for week 1', () => {
      const result = getWeekStartDate(1, new Date('2026-01-15'));
      expect(result.getMonth()).toBe(0); // January
      expect(result.getDate()).toBe(1);
    });

    it('returns correct start date for week 5 (second month)', () => {
      const result = getWeekStartDate(5, new Date('2026-01-15'));
      expect(result.getMonth()).toBe(1); // February
      expect(result.getDate()).toBe(1);
    });
  });

  describe('formatDateRange', () => {
    it('formats date range within same month correctly', () => {
      const start = new Date('2026-01-01');
      const end = new Date('2026-01-07');
      expect(formatDateRange(start, end)).toBe('Jan 1-7, 2026');
    });

    it('formats date range across different months correctly', () => {
      const start = new Date('2026-01-25');
      const end = new Date('2026-02-05');
      expect(formatDateRange(start, end)).toBe('Jan 25 - Feb 5, 2026');
    });
  });

  describe('formatAuditTimestamp', () => {
    it('formats Date object correctly', () => {
      const date = new Date('2026-01-15T14:30:00Z');
      const result = formatAuditTimestamp(date);
      // Note: Time formatting may vary by timezone, so we check the structure
      expect(result).toMatch(/Jan 15, 2026 at \d{1,2}:\d{2} (AM|PM)/);
    });

    it('formats ISO string date correctly', () => {
      const dateString = '2026-01-15T14:30:00Z';
      const result = formatAuditTimestamp(dateString);
      expect(result).toMatch(/Jan 15, 2026 at \d{1,2}:\d{2} (AM|PM)/);
    });

    it('formats different times of day correctly', () => {
      const morningDate = new Date('2026-01-15T09:15:00Z');
      const afternoonDate = new Date('2026-01-15T14:45:00Z');
      
      const morningResult = formatAuditTimestamp(morningDate);
      const afternoonResult = formatAuditTimestamp(afternoonDate);
      
      expect(morningResult).toMatch(/Jan 15, 2026 at \d{1,2}:\d{2} (AM|PM)/);
      expect(afternoonResult).toMatch(/Jan 15, 2026 at \d{1,2}:\d{2} (AM|PM)/);
    });

    it('includes month, day, year, and time with AM/PM', () => {
      const date = new Date('2026-02-28T16:20:00Z');
      const result = formatAuditTimestamp(date);
      expect(result).toContain('Feb');
      expect(result).toContain('28');
      expect(result).toContain('2026');
      expect(result).toContain('at');
      expect(result).toMatch(/(AM|PM)/);
    });
  });
});
