# ZeroDolg Astro - Project Rules

> **Project-specific rules for Warp's Agent Mode**  
> This file provides context, coding standards, and conventions for the ZeroDolg
> bankruptcy law firm corporate website.

## 📋 Project Overview

**Project**: ZeroDolg Astro - Corporate website for bankruptcy legal services  
**Tech Stack**: Astro 5.13.7 + Preact 10.27.1 + TypeScript 5.9.2 + Tailwind CSS
3.4.17  
**Architecture**: Feature-Sliced Design (FSD) + Islands Architecture  
**Target**: Production-ready corporate website with 0 TypeScript errors

## 🎯 Core Principles

### Architecture & Design

1. **Feature-Sliced Design (FSD)** - Organize code by layers and features:
   - `app/` - Application layer (layouts, providers, global styles)
   - `pages/` - Pages layer (routes)
   - `widgets/` - Complex UI blocks (Header, Footer, FAQ)
   - `features/` - Business functions (calculator, forms, modals)
   - `entities/` - Business entities (blog, team, reviews)
   - `shared/` - Reusable resources (independent)

2. **Islands Architecture** - Use Preact islands only for interactive
   components:
   - Static components: Use Astro components
   - Interactive islands: Place in `src/islands/` with `client:*` directives
   - Prefer `client:load` for critical interactions, `client:visible` for
     below-fold content

3. **Dependency Rules**:
   - Layers can only use lower layers (e.g., `features/` can use `entities/` and
     `shared/`)
   - `shared/` layer is independent - no dependencies on other layers
   - Features don't know about each other

### Code Quality Standards

1. **TypeScript**:
   - Maintain **0 TypeScript errors** at all times
   - Use `strict: true` mode with all checks enabled
   - Prefer explicit types over `any`
   - Use type imports: `import type { Type } from './types'`

2. **Naming Conventions**:
   - **Files**: kebab-case for regular files (`team-members.ts`)
   - **Components**: PascalCase for component files (`Button.tsx`,
     `Header.astro`)
   - **Hooks**: camelCase with `use` prefix (`useLocalStorage.ts`)
   - **Types**: PascalCase for types and interfaces (`TeamMember`, `FormData`)
   - **Constants**: SCREAMING_SNAKE_CASE for constants (`API_BASE_URL`)

3. **Import Order**:

   ```typescript
   // 1. External dependencies
   import { h } from 'preact';
   import type { FunctionalComponent } from 'preact';

   // 2. Internal imports by FSD layers (top to bottom)
   import { Layout } from '@/app/layouts';
   import { Calculator } from '@/features/calculator';
   import { BlogPost } from '@/entities/blog';
   import { Button } from '@/shared/ui';

   // 3. Types
   import type { ButtonProps } from './types';

   // 4. Styles
   import './styles.css';
   ```

4. **File Organization**:
   - Keep files under 300 lines (split if larger)
   - One component per file
   - Co-locate tests with source files: `Component.test.ts`
   - Use index files for clean exports: `index.ts`

## 🎨 Styling Guidelines

### Tailwind CSS 3.4

1. **Utility-First Approach**:
   - Use Tailwind utilities directly in markup
   - Create reusable components in `src/shared/ui/` for repeated patterns
   - Use `@apply` sparingly - prefer composition

2. **Responsive Design**:
   - Mobile-first breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px),
     `xl:` (1280px)
   - Test all breakpoints for each component
   - Use responsive utilities: `hidden md:block`, `text-sm lg:text-base`

3. **Class Organization** (use `cn()` helper from `@/shared/utils/cn`):

   ```typescript
   import { cn } from '@/shared/utils/cn';

   const buttonClasses = cn(
     'base-classes',
     'responsive-classes md:modifier',
     condition && 'conditional-classes',
     variant === 'primary' ? 'primary-classes' : 'secondary-classes'
   );
   ```

4. **Custom Utilities**:
   - Define in `src/app/styles/theme.css`
   - Use CSS custom properties for dynamic values
   - Follow Tailwind naming conventions

## 🧩 Component Development

### Astro Components (.astro)

```astro
---
// 1. Type definitions
import type { Props } from './types';

// 2. Props with TypeScript interface
interface Props {
  title: string;
  description?: string;
}

// 3. Destructure props with defaults
const { title, description = 'Default description' } = Astro.props;

// 4. Component logic
const processedTitle = title.toUpperCase();
---

<!-- 5. Template with semantic HTML -->
<article class='container mx-auto px-4'>
  <h2 class='text-2xl font-bold'>{processedTitle}</h2>
  {description && <p class='text-gray-600'>{description}</p>}
</article>
```

### Preact Components (.tsx)

```typescript
import { h } from 'preact';
import type { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { cn } from '@/shared/utils/cn';

interface Props {
  initialValue: string;
  onSubmit: (value: string) => void;
}

export const Component: FunctionalComponent<Props> = ({ initialValue, onSubmit }) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      <input
        type="text"
        value={value}
        onInput={(e) => setValue((e.target as HTMLInputElement).value)}
        class="border rounded px-4 py-2"
      />
      <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded">
        Submit
      </button>
    </form>
  );
};
```

## 🧪 Testing Standards

### Unit Tests (Vitest)

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/preact';
import { Component } from './Component';

describe('Component', () => {
  it('renders with correct props', () => {
    const { getByText } = render(<Component title="Test" />);
    expect(getByText('Test')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const onSubmit = vi.fn();
    const { getByRole } = render(<Component onSubmit={onSubmit} />);

    await userEvent.click(getByRole('button'));
    expect(onSubmit).toHaveBeenCalled();
  });
});
```

### Testing Requirements

- Write tests for all business logic in `src/features/`
- Test user interactions in interactive islands
- Achieve >80% code coverage for critical paths
- Use descriptive test names:
  `it('should handle form submission with validation errors')`

## 🔒 Security & Performance

### Security Best Practices

1. **Environment Variables**:
   - Never commit `.env` files
   - Use `PUBLIC_` prefix for client-side variables
   - Validate env vars with `src/shared/lib/env-validator.ts`

2. **Content Security Policy**:
   - CSP headers configured in `astro.config.*.mjs`
   - Use nonce for inline scripts
   - Whitelist trusted domains only

3. **Input Validation**:
   - Validate all user inputs with Zod schemas
   - Sanitize data before rendering
   - Use TypeScript for type safety

### Performance Guidelines

1. **Core Web Vitals 2025 Targets**:
   - LCP < 1.0s
   - FID < 75ms
   - CLS < 0.05

2. **Optimization Techniques**:
   - Use Astro's static generation by default
   - Lazy load images with `loading="lazy"`
   - Minimize JavaScript bundles with Islands Architecture
   - Use `client:visible` for below-fold interactive components
   - Optimize images to WebP/AVIF formats

3. **Bundle Management**:
   - Keep island components small (<50KB)
   - Split large features into multiple islands
   - Use dynamic imports for heavy libraries

## ♿ Accessibility Requirements

### WCAG 2.2 Compliance

1. **Semantic HTML**:

   ```html
   <!-- Good -->
   <button type="button" aria-label="Close modal">×</button>

   <!-- Bad -->
   <div onclick="close()">×</div>
   ```

2. **Keyboard Navigation**:
   - All interactive elements must be keyboard accessible
   - Implement focus traps for modals
   - Use `useFocusTrap` hook from `@/shared/hooks`
   - Provide visible focus indicators

3. **ARIA Attributes**:
   - Use proper ARIA roles: `role="dialog"`, `role="navigation"`
   - Provide `aria-label` for icon-only buttons
   - Use `aria-describedby` for form field errors
   - Manage focus with `aria-hidden` and `inert`

4. **Color Contrast**:
   - Minimum 4.5:1 for normal text
   - Minimum 3:1 for large text (18px+)
   - Test with accessibility tools

## 🚀 Development Workflow

### Git Workflow

1. **Branch Naming**:
   - Features: `feature/add-calculator`
   - Fixes: `fix/form-validation-bug`
   - Hotfixes: `hotfix/critical-security-patch`

2. **Commit Messages** (Conventional Commits):

   ```bash
   feat(calculator): add debt calculation feature
   fix(forms): resolve validation error handling
   docs(readme): update installation instructions
   style(button): improve hover states
   refactor(hooks): simplify useLocalStorage implementation
   test(calculator): add unit tests for edge cases
   chore(deps): update astro to 5.13.7
   ```

3. **Pre-commit Checks** (Husky hooks):
   - ESLint: `npm run lint`
   - TypeScript: `npm run type-check`
   - Prettier: `npm run format:check`
   - Tests: `npm run test`

### Common Commands

```bash
# Development
npm run dev                    # Start dev server (http://localhost:4321)
npm run build                  # Build for production
npm run build:prod             # Build with production optimizations
npm run preview                # Preview production build

# Quality Assurance
npm run type-check             # TypeScript type checking
npm run lint                   # ESLint linting
npm run lint:fix               # Auto-fix ESLint issues
npm run format                 # Format with Prettier
npm run format:check           # Check formatting

# Testing
npm run test                   # Run unit tests
npm run test:watch             # Watch mode
npm run test:coverage          # Coverage report
npm run test:e2e               # E2E tests with Puppeteer

# Security & Performance
npm run tools:semgrep          # Security scanning
npm run tools:trufflehog       # Secret leak detection
npm run maintenance:lighthouse # Performance audit

# Deployment
npm run deploy:checklist       # Pre-deployment checklist
npm run deploy:verify          # Verify build integrity
npm run deploy:backup          # Create backup
```

## 🤖 AI-Assisted Development

### Using Warp Agent Mode

1. **Code Generation**:
   - Provide context: "Create a new Preact form component following FSD
     architecture"
   - Specify layer: "Add validation logic to features/forms/"
   - Include requirements: "Implement with TypeScript, Zod validation, and
     accessibility"

2. **Refactoring**:
   - Reference existing patterns: "Refactor this component to use the
     useLocalStorage hook"
   - Specify standards: "Update to match project naming conventions"
   - Request testing: "Add unit tests for this function"

3. **Debugging**:
   - Provide error context: "Fix TypeScript errors in src/features/calculator/"
   - Include constraints: "Maintain current API without breaking changes"
   - Request validation: "Ensure accessibility standards are maintained"

### Integration with Qwen Code & MCP

- Use Qwen Code for complex code generation and refactoring
- Leverage Model Context Protocol (MCP) for enhanced AI capabilities
- Reference project documentation in `.qwen/` and `docs/` directories
- Follow patterns established in `docs/style-guide.md`

## 📚 Project-Specific Patterns

### Custom Hooks (src/shared/hooks/)

The project includes 12 custom hooks for common tasks:

```typescript
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';

// Example usage
const [settings, setSettings] = useLocalStorage(
  'user-settings',
  defaultSettings
);
const debouncedValue = useDebounce(searchQuery, 300);
const isMobile = useMediaQuery('(max-width: 768px)');
```

### Form Handling

```typescript
import { z } from 'zod';
import type { FormData } from '@/shared/types/form';

// Define schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+7\d{10}$/, 'Invalid phone number'),
});

// Validate in component
try {
  const validData = formSchema.parse(formData);
  // Handle valid data
} catch (error) {
  if (error instanceof z.ZodError) {
    // Display validation errors
  }
}
```

### Analytics Integration

```typescript
import { trackEvent } from '@/shared/lib/analytics';

// Track user actions
trackEvent('form_submit', {
  formType: 'consultation',
  source: 'homepage',
});
```

## 🔧 Configuration Files

### TypeScript (tsconfig.json)

- Strict mode enabled
- Path aliases configured:
  - `@/*` → `src/*`
  - `@/shared/*` → `src/shared/*`
  - `@/features/*` → `src/features/*`

### ESLint (eslint.config.js)

- Flat config format
- Plugins: `astro`, `@typescript-eslint`
- Custom rules for project conventions

### Tailwind (tailwind.config.cjs)

- Custom color palette
- Extended spacing scale
- Typography plugin configured

## 📋 Quick Reference

### File Structure Cheat Sheet

```
New feature → src/features/[feature-name]/
New entity → src/entities/[entity-name]/
New UI component → src/shared/ui/[ComponentName]/
New hook → src/shared/hooks/use[HookName].ts
New type → src/shared/types/[type-name].ts
New page → src/pages/[page-name].astro
```

### Code Review Checklist

- [ ] 0 TypeScript errors (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Prettier formatted (`npm run format`)
- [ ] Tests pass (`npm run test`)
- [ ] Accessibility standards met (keyboard nav, ARIA, contrast)
- [ ] Performance optimized (lazy loading, code splitting)
- [ ] Security validated (no secrets, input sanitization)
- [ ] Documentation updated (JSDoc comments, README)
- [ ] Follows FSD architecture principles
- [ ] Mobile-responsive design tested

## 🎓 Learning Resources

### Internal Documentation

- Architecture: `docs/architecture.md`
- Style Guide: `docs/style-guide.md`
- Git Workflow: `docs/git.md`
- Migration Guides: `docs/migrations/`

### External Resources

- [Astro Documentation](https://docs.astro.build/)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Preact Documentation](https://preactjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)

---

**Last Updated**: 2025-10-01  
**Maintained by**: ZeroDolg Development Team  
**Questions?** Check `CONTRIBUTING.md` or open an issue
