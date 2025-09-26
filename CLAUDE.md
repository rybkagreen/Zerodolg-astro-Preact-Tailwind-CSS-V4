# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

ZeroDolg Astro Website is a corporate website for a legal company specializing
in bankruptcy services for individuals. The project uses Astro v5.13.7 as a
static site generator with Preact for interactive components, organized
according to Feature-Sliced Design principles.

## Development Commands

### Core Development

- `npm run dev` - Start local development server (port 4321)
- `npm run build` - Build project for production with validation
- `npm run build:prod` - Build with production optimizations
- `npm run build:production` - Full production build script
- `npm run preview` - Preview built site locally

### Code Quality

- `npm run lint` - Check code with ESLint
- `npm run lint:fix` - Automatically fix code issues
- `npm run type-check` - Check TypeScript types
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Testing

- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ui` - Run tests with UI interface
- `npm run test:e2e` - Run end-to-end tests with Puppeteer

### Maintenance

- `npm run clean` - Clean compiled files
- `npm run maintenance:audit` - Audit project dependencies
- `npm run maintenance:lighthouse` - Run Lighthouse audit
- `npm run maintenance:optimize-images` - Optimize images

### Deployment

- `npm run deploy` - Deploy the application
- `npm run deploy:verify` - Verify deployment
- `npm run deploy:rollback` - Rollback deployment

## Architecture Overview

### Feature-Sliced Design Structure

```
src/
├── components/          # Reusable UI components (ui/, forms/, sections/, layout/)
├── islands/            # Interactive Preact components only
├── features/           # Business features (analytics/, calculator/, forms/, modals/)
├── widgets/            # Complex UI components
├── pages/              # Page routes
├── layouts/            # Page layouts
├── shared/             # Shared utilities and APIs
├── core/               # Core application logic
└── styles/             # ITCSS styled architecture
```

### Key Architectural Principles

- **Islands Architecture**: Interactive components are isolated and loaded only
  when needed
- **Static Generation**: HTML pre-rendered for maximum performance
- **Progressive Enhancement**: Site works without JavaScript
- **Mobile First**: Design starting with mobile devices

### TypeScript Path Aliases

- `@/*` → `src/*`
- `@core/*` → `src/core/*`
- `@features/*` → `src/features/*`
- `@shared/*` → `src/shared/*`
- `@widgets/*` → `src/widgets/*`
- `@styles/*` → `src/styles/*`
- `@types/*` → `src/core/types/*`
- `@utils/*` → `src/shared/utils/*`

## Technology Stack

### Core Technologies

- **Astro v5.13.7** - Static Site Generator
- **Preact v10.27.1** - Lightweight React alternative for interactive components
- **TypeScript v5.9.2** - Type safety with strict mode
- **Tailwind CSS v4** - Utility-first CSS framework
- **Vitest v3.2.4** - Testing framework
- **Puppeteer v24.22.3** - End-to-end testing

### Styling Architecture

- **ITCSS** - Inverted Triangle CSS methodology
- **BEM** - Block, Element, Modifier naming convention
- **Tailwind CSS v4** - Modern utility-first framework
- **CSS Custom Properties** - For design tokens

## Code Conventions

### TypeScript Configuration

- Strict mode enabled with comprehensive type checking
- ES2022 target with modern module resolution
- JSX configured for Preact with `jsxImportSource: 'preact'`

### ESLint Rules

- TypeScript-specific rules with 2025 best practices
- Astro file support with accessibility rules
- Relaxed rules for scripts, tools, and test files
- No inline styles or `!important` in CSS

### Component Patterns

- **Astro Components**: Static HTML with minimal JavaScript
- **Preact Islands**: Interactive components only where needed
- **Feature-Sliced Design**: Organized by business functionality
- **Semantic HTML**: Proper HTML5 elements and ARIA labels

## Key Integrations

### SEO & Analytics

- `@astrojs/sitemap` for sitemap generation
- `astro-robots-txt` for robots.txt configuration
- Analytics integration with global variables: `gtag`, `ym`, `dataLayer`

### Model Context Protocol (MCP)

- `astro-mcp` integration for enhanced AI capabilities
- MCP-specific commands: `mcp:info`, `mcp:puppeteer`, `mcp:server`

### Environment Variables

Project requires environment variables for full functionality:

```env
# Alibaba CMS
CMS_API_BASE=https://your-cms-endpoint.alibabacloud.com
CMS_API_KEY=your-api-key-here
```

## Development Workflow

### Before Making Changes

1. Check existing implementations and patterns
2. Review similar components for consistency
3. Verify design requirements and responsive behavior
4. Check TypeScript path aliases usage

### During Development

1. Follow existing Feature-Sliced Design patterns
2. Write semantic HTML first, then add styling
3. Implement interactivity last (Progressive Enhancement)
4. Test incrementally across different viewports

### After Changes

1. Run `npm run build` to verify compilation
2. Test all interactive components
3. Verify accessibility and responsive design
4. Run `npm run test` to ensure no regressions

## Testing Strategy

### Unit & Integration Tests

- Vitest with happy-dom environment
- Component testing with Testing Library
- Coverage reporting with v8 provider
- Test files in `__tests__/` directory

### End-to-End Tests

- Puppeteer for browser automation
- Comprehensive test coverage
- UI testing capabilities

## Production Considerations

### Build Optimization

- Tree-shaking for CSS and JavaScript
- Image optimization with Sharp
- Static generation for maximum performance
- CDN-ready asset structure

### Performance

- Mobile-first responsive design
- Lazy loading for interactive components
- Optimized bundle sizes
- Core Web Vitals optimization

## Special Notes

### Git Hooks

- Husky configured for pre-commit hooks
- Lint-staged for automatic code formatting
- Pre-commit validation ensures code quality

### File Organization

- Scripts organized in `scripts/` directory by purpose
- Tools in `tools/` directory for standalone utilities
- Documentation in `docs/` with comprehensive guides

### Browser Support

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Progressive enhancement ensures basic functionality
- No legacy browser support required
