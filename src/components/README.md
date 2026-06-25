# Components

Reusable React components for ShuttleCoach.

## Directory Structure

```
components/
├── common/              # Shared UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Modal.tsx
│   └── Input.tsx
├── layout/              # Layout components
│   ├── DashboardLayout.tsx
│   ├── TopNav.tsx
│   ├── Sidebar.tsx
│   └── Container.tsx
└── features/            # Feature-specific components
    ├── StudentCard.tsx
    ├── SkillAssessmentForm.tsx
    ├── FeeTable.tsx
    └── ...
```

## Best Practices

1. **Props Interface**: Define a Props interface for each component
2. **Type Safety**: All props should be typed
3. **Documentation**: Add JSDoc comments for public APIs
4. **Styling**: Use Tailwind CSS classes + design system utilities
5. **Accessibility**: Include ARIA labels, semantic HTML
6. **Reusability**: Design for multiple use cases

## Example Component

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled,
  children 
}: ButtonProps) {
  const baseClasses = 'btn rounded-md font-semibold transition-all';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary'
  };
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}
```

## Component Organization

- **common/** - Generic UI components used across the app
- **layout/** - Layout wrapper components
- **features/** - Business logic components specific to features
