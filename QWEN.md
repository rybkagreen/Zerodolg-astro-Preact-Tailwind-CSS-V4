# Qwen Code Configuration

This file contains comprehensive settings, preferences, and guidelines for Qwen Code to work effectively with the zerodolg-astro project.

## Project Information

- **Project Name**: ZeroDolg Astro Website
- **Framework**: Astro v5.13.5
- **Primary Language**: Russian (content and UI) with English (code and comments)
- **Project Type**: Corporate website for a bankruptcy legal services company
- **Domain**: zerodolg.ru
- **Target Audience**: Russian individuals and businesses seeking bankruptcy services

## Technology Stack

### Core Technologies

- **Astro**: v5.13.5 - Static Site Generator
- **Preact**: v10.27.1 - For interactive components (islands architecture)
- **TypeScript**: v5.9.2 - Type safety for complex components
- **CSS**: Modern CSS with custom properties
- **Node.js**: Runtime environment

### Architecture

- **Feature-Sliced Design**: Organized by business features and layers
- **Islands Architecture**: Interactive components only where needed
- **Static Generation**: Pre-rendered HTML for performance
- **Progressive Enhancement**: Works without JavaScript
- **Component-Based**: Modular and reusable components

## Project Structure

```
zerodolg-astro/
├── .github/                    # GitHub-specific files
│   └── workflows/              # GitHub Actions workflows
│       └── ci.yml              # CI/CD pipeline
├── .husky/                     # Git hooks configuration
├── .qwen/                      # Qwen AI assistant configuration
├── .vscode/                    # VS Code configuration
├── docs/                       # Documentation files
│   ├── optimization/           # Optimization guides and checklists
│   └── setup/                  # Setup and configuration docs
├── public/                     # Static assets
├── screenshots/                # Screenshots and comparison reports
├── scripts/                    # Organized development scripts
│   ├── build/                  # Build-related scripts
│   ├── deploy/                 # Deployment scripts
│   ├── dev/                    # Development utilities
│   ├── maintenance/            # Maintenance and optimization
│   └── test/                   # Testing scripts
├── src/                        # Source code
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Base UI components (Button, Card, etc.)
│   │   ├── forms/              # Form components
│   │   ├── layout/             # Layout components (Header, Footer, etc.)
│   │   └── sections/           # Page sections (Hero, Benefits, etc.)
│   ├── islands/                # Interactive Preact components only
│   │   ├── forms/              # Interactive form components
│   │   ├── interactive/        # Interactive components (TeamInteractive, etc.)
│   │   ├── layout/             # Interactive layout components
│   │   ├── shared/             # Shared interactive components
│   │   └── utils/              # Interactive utilities
│   ├── features/               # Business-feature specific logic
│   │   ├── analytics/          # Analytics feature
│   │   ├── calculator/         # Calculator feature
│   │   ├── forms/              # Form handling feature
│   │   └── modals/             # Modal dialogs feature
│   ├── layouts/                # Page layouts
│   ├── pages/                  # Page routes
│   ├── widgets/                # Complex UI components
│   ├── content/                # Content collections
│   ├── lib/                    # Utilities and helper functions
│   ├── shared/                 # Shared utilities and APIs
│   ├── core/                   # Core application logic
│   └── styles/                 # ITCSS styled architecture
├── tools/                      # Standalone utility tools
└── Configuration Files         # Root-level config files
```

## Code Style Guidelines

### General Principles

- **Consistency**: Follow existing patterns in the codebase
- **Readability**: Code should be self-documenting
- **Simplicity**: Prefer simple solutions over complex ones
- **Performance**: Consider performance implications

### Formatting

- **Indentation**: 2 spaces (no tabs)
- **Line Length**: Max 100 characters for code, 80 for comments
- **Semicolons**: Required in JavaScript/TypeScript
- **Quotes**: Single quotes for JavaScript, double for HTML attributes
- **Trailing Commas**: Yes for multi-line objects/arrays

### Naming Conventions

#### Files and Folders

- **Components**: PascalCase (e.g., `ReviewCard.astro`)
- **Sections**: PascalCase (e.g., `HeroSection.astro`)
- **Pages**: kebab-case (e.g., `test-reviews.astro`)
- **Styles**: kebab-case with underscore prefix (e.g., `_reviews.css`)
- **Scripts**: kebab-case (e.g., `reviews-carousel.js`)
- **Utils/Lib**: kebab-case (e.g., `content-service.js`)

#### Code

- **Components**: PascalCase
- **Functions**: camelCase
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **CSS Classes**: BEM methodology (block\_\_element--modifier)
- **CSS Variables**: kebab-case with prefix (e.g., `--color-primary`)

### CSS/Styling Rules

#### BEM Methodology

```css
/* Block */
.review-card {
}

/* Element */
.review-card__header {
}
.review-card__body {
}

/* Modifier */
.review-card--featured {
}
.review-card__header--large {
}
```

#### ITCSS Layers

1. **Settings**: Variables, configurations
2. **Generic**: Reset, normalize
3. **Elements**: HTML elements
4. **Components**: UI components
5. **Sections**: Page sections
6. **Utilities**: Helper classes

## Component Development Guidelines

### Creating New Components

#### 1. Component Structure

```astro
---
// TypeScript/JavaScript logic
import { ComponentProps } from './types';

interface Props {
  title: string;
  // Define all props with TypeScript
}

const { title } = Astro.props;
// Component logic here
---

<!-- HTML template -->
<div class="component-name">
  <!-- Use semantic HTML -->
  <!-- Add ARIA attributes -->
</div>
```

#### 2. Component Location

- **UI Components**: `/src/components/ui/` (buttons, cards, modals, etc.)
- **Form Components**: `/src/components/forms/` (form elements and layouts)
- **Section Components**: `/src/components/sections/` (Hero, Benefits, etc.)
- **Layout Components**: `/src/components/layout/` or `/src/layouts/`
- **Interactive Components**: `/src/islands/` (Preact components only)
- **Feature Components**: `/src/features/[feature-name]/ui/` (feature-specific UI)
- **Complex Widgets**: `/src/widgets/` (complex reusable sections)

#### 3. Component Checklist

- [ ] TypeScript interface for props
- [ ] Semantic HTML structure
- [ ] BEM CSS classes
- [ ] ARIA labels for accessibility
- [ ] Mobile-responsive design
- [ ] Performance optimized (lazy loading, etc.)

### Modifying Existing Components

#### Pre-modification Checklist

1. **Understand Current Implementation**
   - Read the existing code thoroughly
   - Check for CSS dependencies
   - Look for JavaScript interactions
   - Review component usage across pages

2. **Impact Analysis**
   - List all pages using the component
   - Check for style inheritance
   - Verify JavaScript dependencies
   - Test responsive behavior

3. **Modification Process**
   - Create a backup or branch
   - Make incremental changes
   - Test after each change
   - Update documentation
   - Test on multiple viewports

## Documentation Standards

<!-- NOTE: When documenting components, functions, etc., use HTML-style comments -->
<!-- to avoid import errors in the Qwen environment -->
<!-- For example, use <!-- @component Name --> instead of @component Name -->

### General Documentation Guidelines

To prevent import errors in the Qwen environment:
- When documenting with JSDoc-style comments, use HTML-style comments to wrap tags
- Example: Use <!-- @component Name --> instead of @component Name
- This prevents the Qwen processor from trying to import these as modules
- Follow consistent formatting across all documentation

### Component Documentation

```astro
---
/**
 * <!-- @component ReviewCard -->
 * <!-- @description Displays a single customer review with rating and details -->
 * <!-- @example -->
 * <ReviewCard
 *   name="John Doe"
 *   rating={5}
 *   text="Great service!"
 * />
 */
---
```

### Function Documentation

```javascript
/**
 * Calculates review statistics from an array of reviews
 * <!-- @param {Review[]} reviews - Array of review objects -->
 * <!-- @returns {ReviewStats} Statistics object with averages and counts -->
 * <!-- @example -->
 * const stats = calculateReviewStats(reviews);
 */
function calculateReviewStats(reviews) {
  // Implementation
}
```

### CSS Documentation

```css
/* ==========================================================================
   Component Name - Brief Description
   
   Modifiers:
   - .component--modifier: Description of modifier
   
   States:
   - .is-active: Active state styling
   - .is-disabled: Disabled state styling
   ========================================================================== */
```

<!-- Additional notes about documentation formatting to prevent import errors -->
<!-- When documenting, avoid using @component, @description, @example, @param, @returns directly -->
<!-- Instead, use HTML-style comments inside documentation blocks to prevent import errors -->

## Workflow Preferences

### Development Process

1. **Before Making Changes**
   - Check existing implementations
   - Review similar components
   - Verify design requirements
   - Check responsive behavior

2. **During Development**
   - Follow existing patterns
   - Write semantic HTML first
   - Add styling through CSS classes
   - Implement interactivity last
   - Test incrementally

3. **After Changes**
   - Run build: `npm run build`
   - Test all viewports
   - Verify accessibility
   - Update documentation
   - Commit with descriptive message

### Script Organization

The project follows a structured approach to scripts and tools:

- **Build Scripts** (`scripts/build/`): Production builds with optimizations
- **Deployment Scripts** (`scripts/deploy/`): Complete deployment process, verification, and rollback
- **Development Scripts** (`scripts/dev/`): Environment validation and setup
- **Maintenance Scripts** (`scripts/maintenance/`): Dependency auditing, image optimization, performance auditing
- **Test Scripts** (`scripts/test/`): Testing with coverage, E2E tests, environment validation
- **Standalone Tools** (`tools/`): Utilities that can be run independently (site comparison, CSS diagnosis, etc.)

### Git Commit Messages

```
type(scope): brief description

Detailed explanation if needed

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Tests
- chore: Maintenance
```

## Communication Guidelines

### Language Usage

- **Code & Comments**: English
- **Content & UI Text**: Russian
- **Documentation**: English with Russian examples where needed
- **Commit Messages**: English
- **Error Messages**: Russian for user-facing, English for dev

### Response Style

- Be concise but thorough
- Explain technical decisions
- Provide code examples
- Include potential side effects
- Suggest alternatives when appropriate

## Project Specifics

- This is a migration project from an older website
- Pay attention to SEO requirements
- Maintain existing URL structures where possible
- Ensure mobile responsiveness
- Follow any accessibility guidelines already established
- Scripts are organized by function (build, deploy, test, maintenance) in the scripts/ directory
- Standalone tools are kept in the tools/ directory
- Documentation is centralized in the docs/ directory

## ⚠️ CRITICAL REQUIREMENTS - MUST FOLLOW

### Absolute Prohibitions

- **NO INLINE STYLES**: NEVER use `style="..."` or `style={...}` attributes
- **NO !important**: NEVER use `!important` in CSS
- **NO Global Styles**: Except in designated global files
- **NO Direct DOM Manipulation**: Use Preact for interactive components
- **NO Blocking Scripts**: All scripts must be async or deferred

### Mandatory Practices

- **CSS Classes Only**: All styling through CSS classes
- **BEM Methodology**: Strict BEM naming for CSS
- **Progressive Enhancement**: Must work without JavaScript
- **Semantic HTML**: Use proper HTML5 semantic elements
- **ARIA Labels**: For all interactive elements
- **Alt Text**: For all images
- **Mobile First**: Design for mobile, enhance for desktop

## Tools and Commands

- Use npm as the package manager
- Astro-specific commands when needed
- Shell scripts already present in the project can be referenced

## Performance Guidelines

### Image Optimization

- Use WebP format with fallbacks
- Implement lazy loading
- Provide multiple sizes (srcset)
- Use proper aspect ratios
- Optimize file sizes (< 200KB ideally)

### CSS Optimization

- Minimize specificity
- Use CSS custom properties
- Avoid deep nesting (max 3 levels)
- Group related properties
- Use shorthand where appropriate

### JavaScript Optimization

- Use Preact islands only where needed
- Lazy load non-critical scripts
- Minimize bundle size
- Use native APIs when possible
- Implement debouncing/throttling

## Testing Checklist

### Before Committing

- [ ] Build passes: `npm run build`
- [ ] No console errors
- [ ] Mobile responsive (320px - 2560px)
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] Lighthouse score > 90
- [ ] No accessibility issues
- [ ] Images optimized
- [ ] No inline styles
- [ ] No !important in CSS

## Common Patterns

### Responsive Breakpoints

```css
/* Mobile First */
/* <!-- @media (min-width: 768px) --> */
@media (min-width: 768px) {
  /* Tablet */
}
/* <!-- @media (min-width: 1024px) --> */
@media (min-width: 1024px) {
  /* Desktop */
}
/* <!-- @media (min-width: 1440px) --> */
@media (min-width: 1440px) {
  /* Large Desktop */
}
```

### CSS Variables

```css
:root {
  /* Colors */
  --color-primary: #007bff;
  --color-secondary: #6c757d;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;

  /* Typography */
  --font-base: 16px;
  --line-height: 1.6;
}
```

### Component State Classes

```css
.component.is-active {
}
.component.is-disabled {
}
.component.is-loading {
}
.component.has-error {
}
```

## Troubleshooting Guide

### Documentation-Related Issues

If you encounter import errors related to documentation tags (component, description, example, param, returns, media):
- Check if JSDoc-style tags are being processed as imports
- Use HTML-style comments to wrap documentation tags in examples
- Example: Use <!-- @component Name --> instead of @component Name in documentation

### Common Issues

1. **Build Failures**
   - Check for syntax errors
   - Verify imports
   - Check file paths
   - Review TypeScript errors

2. **Style Issues**
   - Check CSS specificity
   - Verify BEM naming
   - Look for conflicting styles
   - Check responsive breakpoints

3. **Performance Issues**
   - Check image sizes
   - Review JavaScript bundles
   - Minimize CSS
   - Enable caching

## Resources

### Documentation

- [Astro Docs](https://docs.astro.build)
- [Preact Docs](https://preactjs.com)
- [TypeScript Docs](https://www.typescriptlang.org)
- [BEM Methodology](http://getbem.com)
- [ITCSS Architecture](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/)

### Project Files

- Main styles: `/src/styles/main.css`
- Global styles: `/src/styles/global.css`
- Variables: `/src/styles/00-settings/_variables.css`
- Components: `/src/components/`
- Pages: `/src/pages/`
- Build scripts: `/scripts/build/`
- Deployment scripts: `/scripts/deploy/`
- Test scripts: `/scripts/test/`
- Maintenance scripts: `/scripts/maintenance/`
- Standalone tools: `/tools/`
- Documentation: `/docs/`

### Project Documentation

All project documentation is located in the `/docs/` directory:

- [Architecture](docs/architecture.md) - Project architecture overview with Feature-Sliced Design
- [Components](docs/components.md) - Component documentation
- [Style Guide](docs/style-guide.md) - Code style guidelines
- [Deployment](docs/deployment.md) - Deployment instructions
- [CMS Guide](docs/cms-guide.md) - Alibaba CMS integration
- [FAQ](docs/faq.md) - Frequently asked questions
- [Security](docs/security.md) - Security guidelines
- [Testing](docs/testing.md) - Testing guidelines
- [Performance](docs/performance.md) - Performance optimization
- [i18n](docs/i18n.md) - Internationalization
- [SEO](docs/seo.md) - Search engine optimization
- [Accessibility](docs/accessibility.md) - Accessibility guidelines
- [Git](docs/git.md) - Git workflow and conventions

## Change Log

### 25.09.2025 - Feature-Sliced Design Implementation

- Reorganized project structure according to Feature-Sliced Design principles
- Moved interactive components to src/islands/ directory
- Relocated UI components to appropriate directories (ui, forms, sections)
- Updated import paths in all affected files
- Updated documentation to reflect new structure

### 12.09.2025 - Claude Review

- Fixed inline styles in TeamInteractive.astro
- Added comprehensive documentation
- Updated requirements and guidelines

### 12.09.2025 - Qwen Updates

- Added CMS integration
- Created content service files
- Updated Reviews and Team sections
- Created comprehensive project documentation in `/docs/` directory
