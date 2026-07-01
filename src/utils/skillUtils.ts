/**
 * Skill Assessment Utilities
 * Bi-monthly cycle key generation and category average calculation.
 *
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */

/**
 * Bi-monthly cycle pairs indexed by month (0-11).
 * Each pair of months maps to the same cycle label.
 */
const CYCLE_LABELS: string[] = [
  'Jan-Feb', // January (0)
  'Jan-Feb', // February (1)
  'Mar-Apr', // March (2)
  'Mar-Apr', // April (3)
  'May-Jun', // May (4)
  'May-Jun', // June (5)
  'Jul-Aug', // July (6)
  'Jul-Aug', // August (7)
  'Sep-Oct', // September (8)
  'Sep-Oct', // October (9)
  'Nov-Dec', // November (10)
  'Nov-Dec', // December (11)
];

/**
 * Generates a bi-monthly cycle key string (e.g., "Jan-Feb 2026").
 * Uses the provided date or defaults to the current date.
 */
export function generateCycleKey(date?: Date): string {
  const d = date ?? new Date();
  const month = d.getMonth(); // 0-11
  const year = d.getFullYear();
  return `${CYCLE_LABELS[month]} ${year}`;
}

/**
 * Calculates the average of skill scores in a category, excluding scores of 0 (not tested).
 * Returns 0 if there are no tested scores.
 * Result is rounded to 1 decimal place.
 */
export function calculateCategoryAverage(scores: number[]): number {
  const testedScores = scores.filter((score) => score > 0);

  if (testedScores.length === 0) {
    return 0;
  }

  const sum = testedScores.reduce((acc, score) => acc + score, 0);
  return parseFloat((sum / testedScores.length).toFixed(1));
}

/**
 * Determines if a given cycle key represents a past cycle (archived).
 * Compares the cycle's end date with the current date.
 * Returns true if the cycle has ended.
 */
export function isCycleArchived(cycleKey: string): boolean {
  const currentCycle = generateCycleKey();
  
  // If it's the current cycle, it's not archived
  if (cycleKey === currentCycle) {
    return false;
  }

  // Parse cycle key format: "Jan-Feb 2026"
  const parts = cycleKey.split(' ');
  if (parts.length !== 2) {
    return false;
  }

  const [monthPair, yearStr] = parts;
  const year = parseInt(yearStr, 10);

  // Determine the end month of the cycle
  const monthPairToEndMonth: Record<string, number> = {
    'Jan-Feb': 1,  // February = month 1
    'Mar-Apr': 3,  // April = month 3
    'May-Jun': 5,  // June = month 5
    'Jul-Aug': 7,  // August = month 7
    'Sep-Oct': 9,  // October = month 9
    'Nov-Dec': 11, // December = month 11
  };

  const endMonth = monthPairToEndMonth[monthPair];
  if (endMonth === undefined) {
    return false;
  }

  // Create date at the end of the cycle (last day of the second month)
  const cycleEndDate = new Date(year, endMonth + 1, 0); // Day 0 = last day of previous month
  const today = new Date();

  // Cycle is archived if its end date is before today
  return cycleEndDate < today;
}

/**
 * Gets all unique cycle keys from curriculum plans, sorted in reverse chronological order.
 * Includes the current cycle if not present in plans.
 */
export function getAllCyclesFromPlans(plans: any[]): string[] {
  const cycleSet = new Set<string>();
  
  // Add all cycles from plans
  plans.forEach((plan: any) => {
    if (plan.cycleKey) {
      cycleSet.add(plan.cycleKey);
    }
  });

  // Always include current cycle
  const currentCycle = generateCycleKey();
  cycleSet.add(currentCycle);

  // Convert to array and sort in reverse chronological order
  const cycles = Array.from(cycleSet).sort((a, b) => {
    // Parse "Month-Month YYYY" format
    const [monthPairA, yearStrA] = a.split(' ');
    const [monthPairB, yearStrB] = b.split(' ');
    
    const yearA = parseInt(yearStrA, 10);
    const yearB = parseInt(yearStrB, 10);

    // Compare years first
    if (yearA !== yearB) {
      return yearB - yearA; // Descending (newest first)
    }

    // If same year, compare month pairs
    const monthOrder = ['Jan-Feb', 'Mar-Apr', 'May-Jun', 'Jul-Aug', 'Sep-Oct', 'Nov-Dec'];
    const indexA = monthOrder.indexOf(monthPairA);
    const indexB = monthOrder.indexOf(monthPairB);
    
    return indexB - indexA; // Descending (newest first)
  });

  return cycles;
}
