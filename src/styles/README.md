# Styles

Global styles, design system tokens, and CSS utilities for ShuttleCoach.

## Files

### globals.css
Main global stylesheet with:
- Tailwind CSS initialization (`@import "tailwindcss"`)
- Font imports (Plus Jakarta Sans, Inter)
- Base element styles
- Custom utility classes
- Dark mode support
- Accessibility features
- Print styles

Features:
- Comprehensive color palette with CSS variables
- Typography scale and font family definitions
- Spacing, border radius, and shadow utilities
- Layout utilities (flexbox, grid, container)
- Form element styling
- Button and input base styles
- Focus states and keyboard navigation
- Dark mode scrollbars and form elements

### design-system.css
Detailed design system with:
- Complete CSS variable tokens (colors, spacing, shadows, etc.)
- Typography classes (.text-display, .text-h1, .text-body, etc.)
- Spacing utilities (.p-xs through .p-2xl, .gap-xs through .gap-2xl)
- Component base styles (.card, .btn, .input, .badge)
- Layout utilities (.flex, .flex-center, .grid, .grid-auto)
- Responsive utilities (.hidden-mobile, .hidden-tablet, .hidden-desktop)
- Animation definitions (@keyframes fadeIn, slideIn, spin)
- Elevation scale (.elevation-card, .elevation-float, .elevation-overlay)
- Utility classes (.truncate, .line-clamp-2, .opacity-50, etc.)

## Design Tokens

### Color System

CSS Variables defined in design-system.css:
```css
--color-primary: #B8E135
--color-success: #B8E135
--color-warning: #F5A623
--color-danger: #E8394A
--color-info: #3A8EF6

--color-slate-50 through --color-slate-950: Complete palette
--surface-background: #FFFFFF
--text-primary: #0A0D11
--border-default: #E4E9EC
```

### Spacing Scale

4px base unit:
```css
--space-xs: 4px
--space-sm: 8px
--space-md: 16px
--space-lg: 24px
--space-xl: 32px
--space-2xl: 48px
```

### Border Radius

```css
--radius-sm: 6px
--radius-md: 10px
--radius-lg: 16px
--radius-pill: 999px
```

### Shadows

```css
--shadow-card: 0 2px 12px rgba(0, 0, 0, 0.07)
--shadow-float: 0 8px 32px rgba(0, 0, 0, 0.14)
--shadow-focus: 0 0 0 3px rgba(184, 225, 53, 0.3)
```

## Using Design System in Components

### Tailwind Classes
```jsx
<div className="bg-primary text-white rounded-md shadow-card p-lg">
  <h1 className="text-h1">Heading</h1>
  <p className="text-body text-secondary">Body text</p>
</div>
```

### CSS Variables
```css
.custom-component {
  color: var(--text-primary);
  background-color: var(--color-slate-50);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
}
```

### Custom Utility Classes
```jsx
<div className="card p-lg gap-md">
  <button className="btn btn-primary">Action</button>
  <input className="input" />
  <span className="badge badge-success">Active</span>
</div>
```

## Responsive Design

Mobile-first approach with breakpoints:
- sm: 640px (small phones)
- md: 768px (tablets)
- lg: 1024px (small desktops)
- xl: 1280px (desktops)
- 2xl: 1536px (large screens)

Usage:
```jsx
// Tailwind responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Custom utility
<div className="hidden-mobile">Only on tablet/desktop</div>
```

## Dark Mode

Automatically supports dark mode via `prefers-color-scheme: dark`:

```css
@media (prefers-color-scheme: dark) {
  body { 
    background-color: var(--surface-dark-background);
    color: var(--text-dark-primary);
  }
}
```

Or manually toggle:
```javascript
document.body.classList.toggle('dark');
```

## Accessibility

- Focus indicators visible on all interactive elements
- High contrast color combinations
- Keyboard navigation support
- Reduced motion support via `prefers-reduced-motion`
- Screen reader text via `.sr-only`

## Performance Notes

- CSS is optimized for tree-shaking via Tailwind
- Critical CSS inlined in production
- Tailwind purges unused styles automatically
- Design tokens centralized to avoid duplication

## File Organization

```
styles/
├── globals.css        # Main global styles & Tailwind
├── design-system.css  # Design tokens & utilities
└── README.md         # This file
```

Both files are imported in `src/main.tsx`:
```typescript
import './styles/globals.css';
import './styles/design-system.css';
```

## Adding Custom Styles

1. **Component-level**: Add CSS module or inline Tailwind classes
2. **Global utilities**: Add to globals.css or design-system.css
3. **Design tokens**: Update CSS variables in design-system.css
4. **Tailwind config**: Extend in tailwind.config.js

Example custom component style in globals.css:
```css
.custom-card {
  @apply rounded-md shadow-card p-lg bg-white;
  transition: all var(--transition-base);
}

.custom-card:hover {
  @apply shadow-float;
}
```
