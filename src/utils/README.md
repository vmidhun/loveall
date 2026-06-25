# Utilities

Reusable utility functions and helpers for ShuttleCoach.

## File Organization

### calc.ts
Calculation utilities:
- `calculateAge(dateOfBirth)` - Calculate age from DOB
- `calculateBMI(height, weight)` - Calculate BMI
- `calculateCategoryAverage(scores)` - Average skill scores
- `getCurrentCycleKey()` - Get current bi-monthly cycle

### validation.ts
Validation functions:
- `isValidEmail(email)` - Email format validation
- `isValidPhone(phone)` - Phone number validation
- `isValidDate(date)` - Date validation
- `validateStudent(data)` - Full student data validation

### format.ts
Formatting utilities:
- `formatDate(date)` - Format date for display
- `formatCurrency(amount)` - Format currency
- `formatPhone(phone)` - Format phone number
- `formatSkillScore(score)` - Format skill score label

### auth.ts
Authentication utilities (Phase 7):
- `generateToken()` - Generate JWT
- `validateToken(token)` - Validate JWT
- `decodeToken(token)` - Decode JWT payload
- `hashPassword(password)` - Hash password (client-side basic)

### api.ts (Phase 7)
API integration utilities:
- `createApiClient()` - Create Axios instance with auth
- `handleApiError()` - Standardized error handling
- `createRequestInterceptor()` - Add auth token to requests

### storage.ts
LocalStorage utilities (Phases 1-6):
- `saveToStorage(key, data)` - Save JSON to localStorage
- `loadFromStorage(key)` - Load JSON from localStorage
- `clearStorage(key)` - Clear specific key
- `getAllStorage()` - Get all stored data

### deep.ts
Object/Array utilities:
- `deepClone(obj)` - Deep clone object
- `deepMerge(obj1, obj2)` - Merge objects
- `mapToArray(obj)` - Convert object to array

### error.ts
Error handling:
- `handleError(error)` - Normalize error objects
- `createErrorMessage(error)` - User-friendly error messages

## Example Utility

```typescript
// calc.ts
export function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) {
    age--;
  }
  
  return age;
}
```

## Usage in Components

```typescript
import { calculateAge } from '@utils/calc';
import { formatDate } from '@utils/format';

function StudentInfo({ student }: { student: Student }) {
  const age = calculateAge(student.dateOfBirth);
  const formattedDOB = formatDate(student.dateOfBirth);
  
  return <div>{age} years old, DOB: {formattedDOB}</div>;
}
```

## Best Practices

1. **Pure functions** - No side effects
2. **Testable** - Easy to unit test
3. **Documented** - JSDoc comments
4. **Organized** - Group related utilities in files
5. **Type-safe** - Full TypeScript support
6. **Reusable** - Extract common patterns
