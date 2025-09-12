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
- **Islands Architecture**: Interactive components only where needed
- **Static Generation**: Pre-rendered HTML for performance
- **Progressive Enhancement**: Works without JavaScript
- **Component-Based**: Modular and reusable components

## Project Structure

```
zerodolg-astro/
├── docs/                # Project documentation
├── src/
│   ├── components/      # Reusable components
│   │   ├── islands/     # Interactive Preact components
│   │   ├── sections/    # Page sections (Hero, Reviews, etc.)
│   │   └── ui/          # UI components (buttons, cards, etc.)
│   ├── content/         # Content collections (reviews, team, etc.)
│   ├── data/            # Static data files
│   ├── layouts/         # Page layouts
│   ├── lib/             # Utility functions and services
│   ├── pages/           # Route pages
│   │   └── api/         # API routes
│   └── styles/          # ITCSS architecture
│       ├── 00-settings/ # Variables and configurations
│       ├── 01-generic/  # Reset and base styles
│       ├── 02-elements/ # HTML element styles
│       ├── 03-components/ # Component styles
│       ├── 04-sections/ # Section-specific styles
│       └── 05-utilities/ # Utility classes
├── public/              # Static assets
│   ├── fonts/           # Web fonts
│   ├── images/          # Images and graphics
│   └── js/              # Client-side JavaScript
└── dist/                # Build output
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
- **CSS Classes**: BEM methodology (block__element--modifier)
- **CSS Variables**: kebab-case with prefix (e.g., `--color-primary`)

### CSS/Styling Rules

#### BEM Methodology
```css
/* Block */
.review-card { }

/* Element */
.review-card__header { }
.review-card__body { }

/* Modifier */
.review-card--featured { }
.review-card__header--large { }
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
- **Static Components**: `/src/components/ui/` or `/src/components/sections/`
- **Interactive Components**: `/src/components/islands/`
- **Layout Components**: `/src/layouts/`

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

### Component Documentation
```astro
---
/**
 * @component ReviewCard
 * @description Displays a single customer review with rating and details
 * @example
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
 * @param {Review[]} reviews - Array of review objects
 * @returns {ReviewStats} Statistics object with averages and counts
 * @example
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
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large Desktop */ }
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
.component.is-active { }
.component.is-disabled { }
.component.is-loading { }
.component.has-error { }
```

## Troubleshooting Guide

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

### Project Documentation
All project documentation is located in the `/docs/` directory:
- [Architecture](docs/architecture.md) - Project architecture overview
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

### 12.09.2025 - Claude Review
- Fixed inline styles in TeamInteractive.astro
- Added comprehensive documentation
- Updated requirements and guidelines

### 12.09.2025 - Qwen Updates
- Added CMS integration
- Created content service files
- Updated Reviews and Team sections
- Created comprehensive project documentation in `/docs/` directory
