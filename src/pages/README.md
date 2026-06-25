# Pages

Page/route components for ShuttleCoach application routes.

## Page Structure

Each page typically:
1. Fetches data from hooks or context
2. Manages page-level state
3. Composes multiple components
4. Handles routing and navigation

## Pages by Phase

### Phase 1: Authentication
- **LoginPage.tsx** - User login form
- **LogoutPage.tsx** - Logout confirmation

### Phase 2: Dashboard & Student Management
- **DashboardPage.tsx** - Main dashboard (role-dependent)
- **StudentListPage.tsx** - List of all students
- **StudentProfilePage.tsx** - Individual student profile
- **StudentCreatePage.tsx** - Create new student

### Phase 3: Skill Assessments
- **SkillAssessmentPage.tsx** - Record skill assessments
- **SkillHistoryPage.tsx** - View assessment history
- **SkillAnalyticsPage.tsx** - Skill progress analytics

### Phase 4: Fee Management
- **FeeManagementPage.tsx** - Manage fees
- **FeeListPage.tsx** - List all fees
- **FeeDetailPage.tsx** - Individual fee details

### Phase 5: Curriculum Planning
- **CurriculumPage.tsx** - Curriculum builder
- **TrainingLogPage.tsx** - Training session logs

### Phase 6: Admin Features
- **CoachManagementPage.tsx** - Manage coaches
- **ReportsPage.tsx** - Generate reports

## Naming Convention

- PascalCase for component names
- Suffix with "Page" for routing components
- Use descriptive names (StudentProfilePage not ProfilePage)

## Example Page Component

```typescript
import { useAuth } from '@hooks/useAuth';
import { useStudents } from '@hooks/useStudents';
import { StudentCard } from '@components/StudentCard';

export function StudentListPage() {
  const { user } = useAuth();
  const { students, loading, error } = useStudents();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container-max py-lg">
      <h1 className="text-h1 mb-lg">Students</h1>
      <div className="grid grid-auto gap-md">
        {students.map(student => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
}
```
