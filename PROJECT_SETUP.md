# ShuttleCoach Project Setup

## Project Overview

ShuttleCoach is a comprehensive badminton training management application built with React, TypeScript, and Vite. The application enables coaches to manage students, track skill development, handle fee payments, plan curriculum, and maintain training logs.

## Technology Stack

- **Frontend Framework**: React 18+
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Custom Design System
- **Linting**: ESLint (Oxlint by default, can switch to ESLint)
- **Code Formatting**: Prettier
- **Fonts**: Plus Jakarta Sans (display), Inter (body)

## Project Structure

```
src/
├── components/       # Reusable React components
├── pages/           # Page/route components
├── hooks/           # Custom React hooks
├── contexts/        # React Context providers (authentication, etc.)
├── utils/           # Utility functions and helpers
├── data/            # JSON data files (phases 1-6) and mock data
├── types/           # TypeScript type definitions
├── styles/          # Global and component styles
│   ├── globals.css       # Global styles with Tailwind imports
│   └── design-system.css # Design tokens and custom utilities
├── App.tsx          # Root application component
└── main.tsx         # Application entry point
```

## Design System

### Color Palette

**Primary Color:**
- Electric Lime: `#B8E135`

**Neutral Palette (Cool Slate):**
- 50: `#F8FAFB` (lightest)
- 100: `#F1F4F6`
- 200: `#E4E9EC`
- 300: `#D1D9DE`
- 400: `#9CA8B3`
- 500: `#6B7885`
- 600: `#4A5662`
- 700: `#333D47`
- 800: `#1F262E`
- 900: `#131820`
- 950: `#0A0D11` (darkest)

**Semantic Colors:**
- Success: `#B8E135` (same as primary)
- Warning: `#F5A623`
- Danger: `#E8394A`
- Info: `#3A8EF6`

### Typography

**Font Families:**
- Display/Headings: Plus Jakarta Sans
- Body/UI: Inter

**Scale:**
- Display: 32px, weight 700
- Heading 1: 24px, weight 700
- Heading 2: 20px, weight 600
- Body: 14px, weight 400
- Small: 12px, weight 400
- Label: 11px, weight 600, uppercase

### Spacing System

Base unit: 4px

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

### Border Radius

- sm: 6px
- md: 10px (default for components)
- lg: 16px
- pill: 999px (for rounded pills)

### Shadows

- Card: `0 2px 12px rgba(0, 0, 0, 0.07)`
- Float: `0 8px 32px rgba(0, 0, 0, 0.14)`
- Focus: `0 0 0 3px rgba(184, 225, 53, 0.3)`
- Overlay: `0 12px 24px rgba(0, 0, 0, 0.15)`

## Getting Started

### Prerequisites

- Node.js 18+ (check with `node -v`)
- npm 9+ (check with `npm -v`)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linting
npm run lint

# Format code with Prettier
npm run format
```

The dev server will start at `http://localhost:5173/`

## Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types (optional)

## Path Aliases

The project is configured with TypeScript path aliases for cleaner imports:

```typescript
import { Button } from '@components/Button';
import { useAuth } from '@hooks/useAuth';
import { User } from '@types';
import { calculateAge } from '@utils/helpers';
```

**Available aliases:**
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@pages/*` → `src/pages/*`
- `@hooks/*` → `src/hooks/*`
- `@contexts/*` → `src/contexts/*`
- `@utils/*` → `src/utils/*`
- `@data/*` → `src/data/*`
- `@types/*` → `src/types/*`
- `@styles/*` → `src/styles/*`

## Tailwind CSS Configuration

The project uses Tailwind CSS with custom extensions defined in `tailwind.config.js`:

**Custom Color Tokens:**
```javascript
colors: {
  primary: '#B8E135',
  slate: { /* cool slate palette */ },
  success: '#B8E135',
  warning: '#F5A623',
  danger: '#E8394A',
  info: '#3A8EF6',
}
```

**Custom Font Families:**
```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
}
```

**Custom Border Radius:**
```javascript
borderRadius: {
  'sm': '6px',
  'md': '10px',
  'lg': '16px',
  'pill': '999px',
}
```

**Custom Shadows:**
```javascript
boxShadow: {
  'card': '0 2px 12px rgba(0, 0, 0, 0.07)',
  'float': '0 8px 32px rgba(0, 0, 0, 0.14)',
}
```

## CSS Architecture

### globals.css
- Tailwind directives (@tailwind)
- Font imports
- Base element styles (html, body, headings, forms)
- Custom utility classes
- Dark mode support
- Accessibility features

### design-system.css
- Comprehensive CSS variable tokens
- Typography scale classes
- Spacing and layout utilities
- Component base styles (card, button, input, badge)
- Animation definitions
- Elevation scale

## Development Workflow

1. **Component Development**: Create components in `src/components/` with corresponding `.tsx` files
2. **Styling**: Use Tailwind CSS classes + custom design system utilities
3. **Type Safety**: Define types in `src/types/` and import across the app
4. **Utilities**: Create reusable functions in `src/utils/`
5. **State Management**: Use React hooks or create context providers in `src/contexts/`
6. **Data**: Mock data stored in `src/data/` JSON files (Phase 1-6)

## Code Quality

- **ESLint**: Configured for React + TypeScript
- **Prettier**: Automatic code formatting (semi: true, singleQuote: true, printWidth: 100)
- **TypeScript**: Strict mode enabled with ESLint integration

Configuration files:
- `.eslintrc.js` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `tsconfig.json` - TypeScript configuration

## Accessibility

The project follows WCAG AA standards:

- Semantic HTML elements
- Keyboard navigation support
- Focus visible indicators
- Color contrast compliance
- Screen reader support via aria labels
- Reduced motion support

Utilities available:
- `.sr-only` - Screen reader only text
- Focus visible styles on all interactive elements
- High contrast mode support

## Dark Mode

The project supports dark mode with:

- CSS variables for theme switching
- `prefers-color-scheme: dark` media query
- Transition support for smooth theme changes
- Styled scrollbars for dark mode

Toggle with: `document.body.classList.toggle('dark')`

## Performance Optimization

- Vite for fast development and optimized builds
- Code splitting via React Router (coming in Phase 2)
- Lazy loading for routes and components
- Tree shaking and minification in production builds

## Environment Variables

Create `.env` and `.env.local` files (not committed) for:

- `VITE_API_URL` - Backend API endpoint (Phase 7)
- `VITE_APP_NAME` - Application name

Example `.env`:
```
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=ShuttleCoach
```

Access in code: `import.meta.env.VITE_API_URL`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

**Port 5173 already in use:**
```bash
npm run dev -- --port 3000
```

**Clear cache and reinstall:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors in IDE:**
- Restart TypeScript server in VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server"

## Next Steps

1. Set up React Router for page navigation (Phase 2)
2. Create authentication system (Phase 1)
3. Build student management components (Phase 2)
4. Implement skill assessment system (Phase 3)
5. Add fee management features (Phase 4)
6. Build curriculum planner (Phase 5)

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Inter Font](https://rsms.me/inter/)
- [Plus Jakarta Sans Font](https://github.com/tokotype/PlusJakartaSans)

## License

Proprietary - ShuttleCoach Application
