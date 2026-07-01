# Curriculum Data Structure Documentation

## Overview

The curriculum system in ShuttleCoach manages 8-week training plans for badminton students. Plans can be created at the **batch level** (for groups of students) or at the **individual level** (for specific students with personalized needs).

## Data Structure

### CurriculumPlan

The main curriculum plan entity containing 8 weeks of structured training.

```typescript
interface CurriculumPlan {
  id: string;                    // Unique identifier
  cycleKey: string;              // Bi-monthly cycle (e.g., "Jan-Feb 2026")
  batchId?: string;              // Set for batch-level plans
  studentId?: string;            // Set for individual plans
  sourceBatchPlanId?: string;    // Reference to original batch plan (if cloned)
  weeks: WeekPlan[];             // Array of 8 weekly plans
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update timestamp
  isArchived: boolean;           // True for past cycles
}
```

### WeekPlan

Individual week within an 8-week curriculum cycle.

```typescript
interface WeekPlan {
  weekNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;  // Week number (strictly typed)
  focusArea: string;                           // Week's primary focus
  drills: Drill[];                             // Training drills for the week
  objective: string;                           // Week's training objective
}
```

### Drill

Individual training exercise with description and category.

```typescript
interface Drill {
  id: string;          // Unique drill identifier
  name: string;        // Drill name
  description: string; // Detailed drill instructions
  category: string;    // Category (e.g., "Footwork", "Stroke Practice", "Service")
}
```

## Critical Constraints

### 1. Batch XOR Student Constraint ⚠️

**A curriculum plan MUST have EITHER `batchId` OR `studentId`, but NOT both.**

This is an **XOR (exclusive OR)** constraint enforced at the application level:

- **Batch Plan**: `batchId` is set, `studentId` is null/undefined
- **Individual Plan**: `studentId` is set, `batchId` is null/undefined
- **Invalid**: Both set or both null

```typescript
// ✓ Valid batch plan
{
  batchId: "batch-001",
  studentId: undefined,
  // ... other fields
}

// ✓ Valid individual plan
{
  batchId: undefined,
  studentId: "student-001",
  // ... other fields
}

// ✗ INVALID - has both
{
  batchId: "batch-001",
  studentId: "student-001",
  // ... other fields
}

// ✗ INVALID - has neither
{
  batchId: undefined,
  studentId: undefined,
  // ... other fields
}
```

**Validation**: Use `validateCurriculumConstraint(plan)` from `utils/curriculumUtils.ts`

### 2. Week Count Constraint

Every curriculum plan **must have exactly 8 weeks**.

```typescript
plan.weeks.length === 8  // Required
```

### 3. Sequential Week Numbers

Week numbers must be **sequential from 1 to 8** without gaps or duplicates.

```typescript
// ✓ Valid
[1, 2, 3, 4, 5, 6, 7, 8]

// ✗ Invalid - has gap
[1, 2, 3, 5, 6, 7, 8]

// ✗ Invalid - has duplicate
[1, 2, 3, 3, 5, 6, 7, 8]
```

## Plan Types

### Batch Plans

Created at the batch level to provide a standard curriculum for all students in a batch.

**Characteristics:**
- `batchId` is set
- `studentId` is null
- `sourceBatchPlanId` is typically null
- Used as templates that can be cloned to individual students

**Example:**
```json
{
  "id": "curriculum-001",
  "cycleKey": "Jan-Feb 2026",
  "batchId": "batch-001",
  "studentId": null,
  "sourceBatchPlanId": null,
  "weeks": [ /* 8 weeks */ ],
  "isArchived": false
}
```

### Individual Plans

Created for specific students with personalized training needs.

**Types:**

1. **Cloned from Batch** - Copy of a batch plan customized for individual needs
   ```json
   {
     "id": "curriculum-003",
     "cycleKey": "Jan-Feb 2026",
     "batchId": null,
     "studentId": "student-001",
     "sourceBatchPlanId": "curriculum-001",  // References original batch plan
     "weeks": [ /* 8 weeks - may differ from source */ ]
   }
   ```

2. **Original Individual Plan** - Created from scratch for a student
   ```json
   {
     "id": "curriculum-004",
     "cycleKey": "Jan-Feb 2026",
     "batchId": null,
     "studentId": "student-005",
     "sourceBatchPlanId": null,  // No source, original plan
     "weeks": [ /* 8 weeks */ ]
   }
   ```

## Sample Data Structure

The `src/data/curriculum.json` file contains sample curriculum plans:

- **2 Batch Plans**: For batch-001 (beginner level) and batch-002 (advanced level)
- **2 Individual Plans**: 
  - student-001: Cloned from batch-001 with modifications for service weakness
  - student-005: Original plan for professional-level student

## Validation Utilities

Located in `src/utils/curriculumUtils.ts`:

### `validateCurriculumConstraint(plan)`
Validates the batchId XOR studentId constraint.

### `isBatchPlan(plan)`
Checks if a plan is a batch plan.

### `isIndividualPlan(plan)`
Checks if a plan is an individual plan.

### `isClonedFromBatch(plan)`
Checks if an individual plan was copied from a batch plan.

### `hasValidWeekCount(plan)`
Validates plan has exactly 8 weeks.

### `hasValidWeekNumbers(plan)`
Validates weeks are numbered 1-8 sequentially.

### `validateCurriculumPlan(plan)`
Comprehensive validation checking all constraints.

**Usage Example:**
```typescript
import { validateCurriculumPlan } from '@/utils/curriculumUtils';

const validation = validateCurriculumPlan(plan);

if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
  // ["Plan must have either batchId OR studentId, but not both"]
}
```

### `getCurriculumDisplayName(plan, batchName?, studentName?)`
Generates user-friendly display name for a plan.

```typescript
// Returns: "Batch: Morning Beginner"
getCurriculumDisplayName(batchPlan, "Morning Beginner");

// Returns: "Individual: Arjun Verma"
getCurriculumDisplayName(individualPlan, undefined, "Arjun Verma");

// Returns: "Individual (Modified): Arjun Verma"
getCurriculumDisplayName(clonedPlan, undefined, "Arjun Verma");
```

## Workflow: Batch Plan Cloning

1. **Head Coach creates batch plan** with 8 weeks of drills and objectives
2. **Batch plan is saved** with `batchId` set, `studentId` null
3. **Clone to students**: System creates individual copies for each student in the batch
4. **Individual plans created**:
   - `studentId` set to each student's ID
   - `batchId` set to null
   - `sourceBatchPlanId` references original batch plan
   - `weeks` array copied from batch plan
5. **Coaches can modify individual plans** without affecting batch plan or other students

## Best Practices

### Creating Curriculum Plans

1. ✓ Always validate plans using `validateCurriculumPlan()` before saving
2. ✓ Ensure exactly 8 weeks with sequential numbering
3. ✓ Set either `batchId` OR `studentId`, never both
4. ✓ Include meaningful drills with clear descriptions
5. ✓ Use consistent drill categories across plans

### Modifying Plans

1. ✓ Mark past cycle plans as `isArchived: true`
2. ✓ Prevent edits to archived plans
3. ✓ When cloning, always set `sourceBatchPlanId`
4. ✓ Update `updatedAt` timestamp on modifications
5. ✓ Preserve drill IDs for consistency across plans

### Displaying Plans

1. ✓ Use `getCurriculumDisplayName()` for user-friendly labels
2. ✓ Show diff indicators when individual plan differs from source
3. ✓ Display warning when editing cloned plans
4. ✓ Group plans by cycle for better organization
5. ✓ Filter archived plans separately from active plans

## Database Schema (Phase 7)

When migrating to PostgreSQL in Phase 7, the constraint will be enforced at the database level:

```sql
CREATE TABLE curriculum_plans (
  id UUID PRIMARY KEY,
  cycle_key VARCHAR(20) NOT NULL,
  batch_id UUID REFERENCES batches(id),
  student_id UUID REFERENCES students(id),
  source_batch_plan_id UUID REFERENCES curriculum_plans(id),
  weeks JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- XOR constraint: exactly one must be NOT NULL
  CONSTRAINT batch_or_student_xor CHECK (
    (batch_id IS NOT NULL AND student_id IS NULL) OR
    (batch_id IS NULL AND student_id IS NOT NULL)
  ),
  
  -- Ensure weeks array has exactly 8 entries
  CONSTRAINT eight_weeks CHECK (
    jsonb_array_length(weeks) = 8
  )
);
```

## Testing

Run validation tests:
```bash
npm run test -- curriculumUtils.test.ts
```

Validate sample data:
```bash
npx tsx src/utils/validateCurriculumData.ts
```

## References

- **Design Document**: `.kiro/specs/shuttlecoach-app/design.md` (Section 3.5)
- **Requirements**: `.kiro/specs/shuttlecoach-app/requirements.md` (Requirements 17.1-17.3)
- **Type Definitions**: `src/types/index.ts` (Curriculum Types section)
- **Sample Data**: `src/data/curriculum.json`
- **Utilities**: `src/utils/curriculumUtils.ts`
