# Data Folder

This folder contains mock data and JSON files for phases 1-6 of the ShuttleCoach application.

## Files

- **users.json** - Sample user data (coaches and students)
- **students.json** - Student profile data
- **assessments.json** - Skill assessment records
- **fees.json** - Fee records and payment history
- **curriculum.json** - Curriculum plans by cycle
- **training-logs.json** - Training session logs

## Phase-Based Data Strategy

### Phases 1-6: JSON-Based
Data is stored as JSON files in this folder and loaded into React state. The application reads and writes to these files simulating a backend database.

### Phase 7: API-Based
When transitioning to Phase 7 with a real backend, the hooks in `@hooks` will be updated to make API calls instead of reading JSON files. The data folder may still contain seed data for initial setup.

## Using Mock Data

Example of loading data in a React component:

```typescript
import usersData from '@data/users.json';

const [users, setUsers] = useState(usersData);
```

## Creating Sample Data

When creating new JSON files, follow these patterns:

1. **Use UUID-like IDs**: `"id": "550e8400-e29b-41d4-a716-446655440000"`
2. **Use ISO date strings**: `"createdAt": "2026-01-15T10:30:00Z"`
3. **Follow type definitions**: Ensure JSON matches interfaces in `@types`

## Note

JSON files in this folder are NOT for production use. They're development/prototyping aids for phases 1-6. In production (Phase 7+), all data flows through the API.
