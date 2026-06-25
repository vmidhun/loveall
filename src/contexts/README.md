# React Contexts

Context providers for global state management in ShuttleCoach.

## Available Contexts

### AuthContext
Manages user authentication state and role-based access.

```typescript
interface AuthContext {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}
```

Usage:
```typescript
import { useContext } from 'react';
import { AuthContext } from '@contexts/AuthContext';

function MyComponent() {
  const { user, role, logout } = useContext(AuthContext);
  // ...
}
```

Or use the custom hook:
```typescript
import { useAuth } from '@hooks/useAuth';

function MyComponent() {
  const { user, role, logout } = useAuth();
  // ...
}
```

### ThemeContext (Future)
Manage light/dark mode theme.

### NotificationContext (Future)
Manage toast notifications and alerts.

## Creating a Context

```typescript
import { createContext, useContext, ReactNode, useState } from 'react';

interface MyContextType {
  value: string;
  setValue: (value: string) => void;
}

export const MyContext = createContext<MyContextType | undefined>(undefined);

export function MyContextProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState('');

  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within MyContextProvider');
  }
  return context;
}
```

## Context Hierarchy

In App.tsx:
```typescript
<AuthProvider>
  <ThemeProvider>
    <NotificationProvider>
      <Router />
    </NotificationProvider>
  </ThemeProvider>
</AuthProvider>
```

## Best Practices

1. **Create custom hook** - Always export useContext wrapper
2. **Validate usage** - Throw error if context used outside provider
3. **Minimal state** - Keep only truly global state here
4. **Type safety** - Full TypeScript support for context values
5. **Performance** - Consider splitting contexts to avoid unnecessary re-renders
