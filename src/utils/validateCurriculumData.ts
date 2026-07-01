/**
 * Script to validate curriculum.json sample data
 * Run this to ensure sample data meets all constraints
 */

import curriculumData from '../data/curriculum.json';
import { validateCurriculumPlan } from './curriculumUtils';
import type { CurriculumPlan } from '../types';

// Convert date strings to Date objects and handle null values
const parsedCurriculum: CurriculumPlan[] = curriculumData.map((plan: any) => ({
  ...plan,
  batchId: plan.batchId ?? undefined,
  studentId: plan.studentId ?? undefined,
  sourceBatchPlanId: plan.sourceBatchPlanId ?? undefined,
  createdAt: new Date(plan.createdAt),
  updatedAt: new Date(plan.updatedAt)
}));

console.log('Validating curriculum.json sample data...\n');

let allValid = true;

parsedCurriculum.forEach((plan, index) => {
  const validation = validateCurriculumPlan(plan);
  
  console.log(`Plan ${index + 1} (${plan.id}):`);
  console.log(`  Cycle: ${plan.cycleKey}`);
  console.log(`  Type: ${plan.batchId ? `Batch (${plan.batchId})` : `Individual (${plan.studentId})`}`);
  console.log(`  Source: ${plan.sourceBatchPlanId || 'Original'}`);
  console.log(`  Weeks: ${plan.weeks.length}`);
  console.log(`  Valid: ${validation.isValid ? '✓' : '✗'}`);
  
  if (!validation.isValid) {
    allValid = false;
    console.log('  Errors:');
    validation.errors.forEach(error => {
      console.log(`    - ${error}`);
    });
  }
  
  console.log('');
});

console.log('='.repeat(50));
if (allValid) {
  console.log('✓ All curriculum plans are valid!');
} else {
  console.log('✗ Some curriculum plans have validation errors');
  // Exit with error code in Node.js environment only
  if (typeof window === 'undefined') {
    throw new Error('Curriculum validation failed');
  }
}

// Summary statistics
const batchPlans = parsedCurriculum.filter(p => p.batchId);
const individualPlans = parsedCurriculum.filter(p => p.studentId);
const clonedPlans = parsedCurriculum.filter(p => p.sourceBatchPlanId);

console.log('\nSummary:');
console.log(`  Total plans: ${parsedCurriculum.length}`);
console.log(`  Batch plans: ${batchPlans.length}`);
console.log(`  Individual plans: ${individualPlans.length}`);
console.log(`  Cloned from batch: ${clonedPlans.length}`);
