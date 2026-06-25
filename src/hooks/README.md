# Custom Hooks

Custom React hooks for ShuttleCoach containing reusable logic.

## Hooks by Category

### Authentication Hooks
- **useAuth()** - Access authentication context (user, role, login, logout)
- **useRoleGuard()** - Protect routes based on user role

### Data Fetching Hooks (JSON-based for phases 1-6)
- **useStudents()** - Fetch and manage students list
- **useStudent()** - Fetch single student data
- **useAssessments()** - Fetch skill assessments
- **useFees()** - Fetch fee records
- **useCurriculum()** - Fetch curriculum plans
- **useTrainingLogs()** - Fetch training logs

### UI/Form Hooks
- **useForm()** - Form state management with validation
- **useModal()** - Modal state management
- **useToast()** - Toast notifications
- **useDebounce()** - Debounce search inputs

### Utility Hooks
- **useLocalStorage()** - Persist state to localStorage
- **useAsync()** - Handle async operations

## Hook Naming Convention

- Prefix with "use"
- PascalCase after "use"
- Descriptive names (useStudents not useFetch)

## Example Hook

```typescript
import { useEffect, useState } from 'react';
import { Student } from '@types';

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        // Phase 1-6: Load from JSON
        // const response = await import('@data/students.json');
        // setStudents(response.default);
        
        // Phase 7: Fetch from API
        // const response = await fetch('/api/students');
        // setStudents(await response.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return { students, loading, error };
}
```

## Hook Best Practices

1. **Return consistent state shape** - { data, loading, error }
2. **Handle cleanup** - Return cleanup function from useEffect
3. **Memoize dependencies** - Properly specify dependency arrays
4. **Type everything** - Full TypeScript support
5. **Document parameters** - JSDoc comments for complex hooks
