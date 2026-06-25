# Type Definitions

TypeScript type definitions for the entire ShuttleCoach application.

## Main Type Categories

### Authentication Types
- `User` - User profile with role and permissions
- `UserRole` - 'HEAD_COACH' | 'ASSISTANT_COACH' | 'STUDENT'
- `AuthContext` - Global auth state shape
- `LoginRequest` / `LoginResponse` - Auth API types

### Student Types
- `Student` - Complete student profile
- `SkillLevel` - 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional'
- `Gender` - 'Male' | 'Female' | 'Other'
- `StudentFilters` - Filter options for student queries

### Skill Assessment Types
- `SkillAssessment` - Assessment record
- `SkillScore` - 0 | 1 | 2 | 3 | 4 (score scale)
- `SkillCategory` - 'forehand' | 'backhand' | 'return' | 'service' | 'overhead' | 'rally'
- `CategoryScores` - Map of skill names to scores
- `Weakness` - Identified weakness with trend

### Fee Types
- `FeeRecord` - Fee payment record
- `FeeStatus` - 'PAID' | 'PENDING' | 'OVERDUE' | 'WAIVED'
- `PaymentMethod` - 'CASH' | 'UPI' | 'BANK_TRANSFER'

### Curriculum Types
- `CurriculumPlan` - Complete curriculum for a cycle
- `WeekPlan` - Plan for a single week (1-8)
- `Drill` - Individual drill/exercise

### Training Log Types
- `TrainingLog` - Training session record

### UI Component Types
- `ButtonProps` - Button component props
- `CardProps` - Card component props
- `BadgeProps` - Badge component props
- `ModalProps` - Modal component props
- `InputProps` - Input field props

### API Types
- `ApiResponse<T>` - Standard API response wrapper
- `ApiError` - Standardized error response
- `PaginatedResponse<T>` - Paginated data response

## Usage in Components

```typescript
import { Student, SkillAssessment, FeeRecord } from '@types';

interface StudentProfileProps {
  student: Student;
  recentAssessment?: SkillAssessment;
  fees: FeeRecord[];
}

export function StudentProfile({ student, recentAssessment, fees }: StudentProfileProps) {
  // Component implementation
}
```

## Usage in Hooks

```typescript
import { useCallback } from 'react';
import { Student, StudentFilters } from '@types';

export function useStudents(filters?: StudentFilters) {
  // Hook implementation
}
```

## Type Safety Best Practices

1. **Always type props** - Use interface for component props
2. **Strict mode** - Enable `strict: true` in tsconfig.json
3. **No any** - Avoid `any` type, use generics instead
4. **Discriminated unions** - Use for complex conditional types
5. **Const assertions** - Use `as const` for literal types

## Common Type Patterns

### Discriminated Union (User Role)
```typescript
type User = 
  | { role: 'HEAD_COACH'; canManageCoaches: true }
  | { role: 'ASSISTANT_COACH'; canManageCoaches?: false }
  | { role: 'STUDENT'; canManageCoaches: false };
```

### Generic API Response
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

type StudentResponse = ApiResponse<Student>;
type StudentsResponse = ApiResponse<Student[]>;
```

### Partial and Omit
```typescript
// For PATCH requests (partial updates)
type UpdateStudentRequest = Partial<Omit<Student, 'id' | 'createdAt'>>;

// For form submissions
type StudentFormData = Omit<Student, 'id' | 'age' | 'bmi' | 'createdAt' | 'updatedAt'>;
```

## Adding New Types

When adding new types:

1. **Group related types** - Keep cohesive types together
2. **Document with JSDoc** - Add comments for complex types
3. **Export explicitly** - Export only public types
4. **Follow naming** - Use PascalCase, descriptive names
5. **Use interfaces for objects**, **types for unions/aliases**

Example:
```typescript
/**
 * Represents a badminton coach with specialization
 * @property specialization - Area of coaching focus (e.g., "Singles", "Doubles")
 */
export interface Coach extends User {
  specialization?: string;
  certifications?: string[];
  yearsOfExperience: number;
}
```

## File Organization

All types are in `src/types/index.ts`. As the app grows, consider organizing into:

```
types/
├── index.ts           # Main export file
├── auth.ts           # Authentication types
├── student.ts        # Student types
├── assessment.ts     # Skill assessment types
├── fee.ts           # Fee types
├── curriculum.ts    # Curriculum types
├── api.ts           # API request/response types
└── ui.ts            # UI component types
```

Then re-export in index.ts:
```typescript
export * from './auth';
export * from './student';
export * from './assessment';
// etc...
```
