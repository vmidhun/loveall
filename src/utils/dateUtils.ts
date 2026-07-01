/**
 * Date Utilities
 * Functions for date calculations and cycle week determination
 */

/**
 * Determines the current week number (1-8) within an 8-week bi-monthly cycle.
 * 
 * Logic:
 * - A bi-monthly cycle spans 2 months (approximately 8-9 weeks)
 * - We divide the cycle into 8 equal weekly periods
 * - Week 1 starts on the 1st of the first month
 * - Each week is approximately 7-8 days
 * 
 * @param date - The date to check (defaults to current date)
 * @returns Week number from 1 to 8
 * 
 * @example
 * // If Jan-Feb 2026 cycle starts Jan 1
 * getCurrentWeekInCycle(new Date('2026-01-05')) // Returns 1
 * getCurrentWeekInCycle(new Date('2026-01-15')) // Returns 3
 * getCurrentWeekInCycle(new Date('2026-02-25')) // Returns 8
 */
export function getCurrentWeekInCycle(date?: Date): 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 {
  const d = date ?? new Date();
  const month = d.getMonth(); // 0-11
  const dayOfMonth = d.getDate(); // 1-31
  
  // Determine if we're in the first or second month of the cycle
  const isFirstMonth = month % 2 === 0; // Jan, Mar, May, Jul, Sep, Nov
  
  if (isFirstMonth) {
    // First month of cycle: weeks 1-4
    // Days 1-7 = week 1, 8-15 = week 2, 16-23 = week 3, 24-31 = week 4
    if (dayOfMonth <= 7) return 1;
    if (dayOfMonth <= 15) return 2;
    if (dayOfMonth <= 23) return 3;
    return 4;
  } else {
    // Second month of cycle: weeks 5-8
    // Days 1-7 = week 5, 8-14 = week 6, 15-21 = week 7, 22+ = week 8
    if (dayOfMonth <= 7) return 5;
    if (dayOfMonth <= 14) return 6;
    if (dayOfMonth <= 21) return 7;
    return 8;
  }
}

/**
 * Gets the start date of a specific week within the current bi-monthly cycle.
 * 
 * @param weekNumber - Week number (1-8)
 * @param cycleStartDate - Start date of the cycle (defaults to 1st of current cycle)
 * @returns Start date of the specified week
 */
export function getWeekStartDate(
  weekNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
  cycleStartDate?: Date
): Date {
  const start = cycleStartDate ?? new Date();
  
  // Calculate the first day of the current cycle
  const month = start.getMonth();
  const year = start.getFullYear();
  
  // Get the first month of the cycle (even month)
  const cycleFirstMonth = month % 2 === 0 ? month : month - 1;
  const cycleStart = new Date(year, cycleFirstMonth, 1);
  
  // Week 1: Jan 1-7, Week 2: Jan 8-15, Week 3: Jan 16-23, Week 4: Jan 24-31
  // Week 5: Feb 1-7, Week 6: Feb 8-14, Week 7: Feb 15-21, Week 8: Feb 22-28/29
  
  if (weekNumber <= 4) {
    // First month weeks
    const daysToAdd = (weekNumber - 1) * 7;
    const weekStart = new Date(cycleStart);
    weekStart.setDate(1 + daysToAdd);
    return weekStart;
  } else {
    // Second month weeks (5-8)
    const secondMonthStart = new Date(year, cycleFirstMonth + 1, 1);
    const daysToAdd = (weekNumber - 5) * 7;
    const weekStart = new Date(secondMonthStart);
    weekStart.setDate(1 + daysToAdd);
    return weekStart;
  }
}

/**
 * Formats a date range for display (e.g., "Jan 1 - Jan 7, 2026")
 * 
 * @param startDate - Start date of the range
 * @param endDate - End date of the range
 * @returns Formatted date range string
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
  const startDay = startDate.getDate();
  const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
  const endDay = endDate.getDate();
  const year = startDate.getFullYear();
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}, ${year}`;
  }
  
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
}

/**
 * Formats a timestamp for audit trail display (e.g., "Jan 15, 2026 at 2:30 PM")
 * Handles both Date objects and ISO string dates
 * 
 * @param date - Date object or ISO date string
 * @returns Formatted timestamp string
 * 
 * @example
 * formatAuditTimestamp(new Date('2026-01-15T14:30:00Z'))
 * // Returns "Jan 15, 2026 at 2:30 PM"
 */
export function formatAuditTimestamp(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const dateStr = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  const timeStr = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  
  return `${dateStr} at ${timeStr}`;
}
