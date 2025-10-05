# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this
repository.

## Project Overview

**ZeroDolg** is a corporate website for a bankruptcy law firm in Russia, built
with Astro v5.13.5 using a hybrid SSR (Server-Side Rendering) architecture. The
site combines static generation with dynamic server endpoints for form
processing and API integrations.

**Tech Stack:**

- Astro 5.13.5 (SSR + Static)
- Preact 10.27.1 (Islands Architecture for interactivity)
- TypeScript 5.9.2 (Strict mode)
- Tailwind CSS v3 (with OKLCH color system)
- Node.js >= 18.17.1

## Architecture

The project follows **Feature-Sliced Design (FSD)** - a modular architecture
organizing code by business features and layers:

### Directory Structure

```
src/
├── app/              # Application entry point, layouts, global styles
├── pages/            # Astro pages (routes)
│   ├── api/          # API endpoints (form.ts for Bitrix24 integration)
│   └── *.astro       # Static pages
├── features/         # Business features (analytics, calculator, forms, modals)
├── entities/         # Business entities (blog, calculator, review, team)
├── widgets/          # Complex UI widgets (faq, footer, header, reviews)
├── components/       # Reusable UI components
│   ├── ui/           # Base UI components
│   ├── forms/        # Form components
│   ├── layout/       # Layout components
│   └── sections/     # Page sections
├── islands/          # Interactive Preact components (client-side JS)
├── shared/           # Shared utilities, types, constants
├── core/             # Core application logic
└── styles/           # Global styles (ITCSS architecture)
```

### Islands Architecture

- Static content rendered at build time (Astro)
- Interactive components (Preact) loaded only when needed
- API endpoints handle server-side logic
- Progressive enhancement: site works without JavaScript

### TypeScript Configuration

- **Strict mode enabled** with comprehensive type checking
- Path aliases configured for clean imports:
  - `@/*` → `src/*`
  - `@app/*` → `src/app/*`
  - `@entities/*` → `src/entities/*`
  - `@features/*` → `src/features/*`
  - `@widgets/*` → `src/widgets/*`
  - `@shared/*` → `src/shared/*`
  - `@pages/*` → `src/pages/*`

## Common Commands

### Development

```powershell
# Start development server (http://localhost:4321)
npm run dev

# Type checking (do this before committing)
npm run type-check
```

### Building

```powershell
# Development build (with env validation)
npm run build

# Production build (optimized with pre-checks)
npm run build:prod

# Full production build with all validations
npm run build:production

# Clean build artifacts
npm run clean
```

### Linting & Formatting

```powershell
# Run ESLint
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting without changes
npm run format:check
```

### Staging Environment (Docker)

```powershell
# Start staging environment
npm run staging:up

# View logs in real-time
npm run staging:logs

# Restart staging
npm run staging:restart

# Stop staging
npm run staging:down

# Clean staging completely
npm run staging:clean
```

**Staging URLs:**

- Web application: `http://localhost:3000`
- Lighthouse CI: `http://localhost:9001`

### Deployment & Maintenance

```powershell
# Environment setup and validation
npm run env:validate
npm run env:setup

# Pre-deployment checklist
npm run deploy:checklist
npm run deploy:verify

# Deployment operations
npm run deploy
npm run deploy:backup
npm run deploy:rollback

# Maintenance tasks
npm run maintenance:audit
npm run maintenance:optimize-images
npm run maintenance:lighthouse
```

### Testing & Tools

```powershell
# Setup Puppeteer for testing
npm run puppeteer:setup

# Run MCP server (Model Context Protocol)
npm run mcp:server
npm run mcp:demo

# Utility tools
npm run tools:compare-sites
npm run tools:semgrep
npm run tools:trufflehog
```

## Code Style & Conventions

### ESLint Configuration

- **Modern flat config** (eslint.config.js)
- TypeScript strict rules with `@typescript-eslint`
- Astro-specific linting with `eslint-plugin-astro`
- Accessibility checks with `jsx-a11y-recommended`
- Console warnings allowed in development, errors in production scripts

### Key Rules

- Use single quotes for strings
- Semicolons required
- Prefer `const` over `let`, never use `var`
- Use arrow functions for callbacks
- Destructuring preferred for objects
- Template literals over string concatenation
- Consistent type imports: `import type { ... }`

### Git Hooks (Husky)

- **pre-commit**: Runs lint-staged (ESLint + Prettier on changed files)
- **commit-msg**: Validates commit message format

## Environment Variables

Copy `.env.example` to `.env` and configure:

**Required:**

- `BITRIX24_WEBHOOK_URL` - Form submission integration

**Optional:**

- `PUBLIC_GA_ID` - Google Analytics
- `PUBLIC_YM_ID` - Yandex Metrika
- `PUBLIC_SITE_URL` - Site URL
- `PUBLIC_SITE_PHONE` - Contact phone
- `PUBLIC_SITE_EMAIL` - Contact email

## API Structure

### Endpoints

**POST /api/form** - Submit forms to Bitrix24

- Handles consultation requests, callback forms
- Validates input data
- Integrates with Bitrix24 CRM

## Build Optimization

The project uses advanced optimizations:

- **Terser minification** with console removal in production
- **CSS tree-shaking** with Lightning CSS
- **Image optimization** with Sharp (AVIF, WebP)
- **Code splitting** with manual chunks for vendors
- **HTML compression** enabled
- **Prefetching** with viewport strategy

## Working with Forms

Forms use a hybrid approach:

1. Static Astro components (server-rendered)
2. Interactive Preact islands for client-side validation
3. Server API endpoints (`/api/form`) for submission
4. Integration with Bitrix24 CRM

## Working with Styles

- **Tailwind CSS v3** with custom design tokens
- **OKLCH color system** for better color science
- **ITCSS architecture** for CSS organization
- **BEM naming** for custom CSS classes
- **Mobile-first** responsive design
- Custom animations and keyframes in `tailwind.config.js`

## Docker & Staging

The project includes a complete Docker setup:

**Services:**

- `zerodolg-web` - Main Nginx + Astro SSR application
- `zerodolg-ssr-server` - Node.js SSR server
- `lighthouse` - Performance testing with Lighthouse CI

**Network:** `zerodolg-staging-network` (bridge)

## Important Notes

### When Making Changes

1. Always run `npm run type-check` before committing
2. Use path aliases (`@/*`) instead of relative paths when possible
3. Follow Feature-Sliced Design principles: features should be independent
4. Keep islands minimal - only make components interactive when necessary
5. Test API endpoints locally before pushing
6. Validate forms both client-side and server-side

### When Working with Astro

- Astro components (`.astro`) are server-rendered by default
- Use `client:*` directives to make Preact islands interactive
- Static pages should be marked with `export const prerender = true`
- Server endpoints must be in `src/pages/api/`

### When Working with TypeScript

- Project uses **strict mode** - all types must be explicit
- No `any` types allowed without `@ts-expect-error` with description
- Use `type` imports: `import type { Foo } from './foo'`
- Unused variables starting with `_` are allowed

### Security Considerations

- Never commit `.env` files
- All form inputs are validated and sanitized
- XSS protection enabled
- HTTPS enforced in production
- Bitrix24 webhook URL must be kept secret

## Testing Strategy

While there are no test files currently, the project includes:

- **Type checking** with TypeScript strict mode
- **Lighthouse CI** for performance testing (in staging)
- **Manual testing** via staging environment
- **Post-build verification** scripts

## Scripts Directory

The `scripts/` directory contains utility scripts organized by purpose:

- `scripts/build/` - Build-related scripts
- `scripts/deploy/` - Deployment automation
- `scripts/dev/` - Development utilities
- `scripts/maintenance/` - Maintenance tasks
- `scripts/staging/` - Staging environment management

All scripts are Node.js modules and can be run directly with `node`.

## Troubleshooting

### Build Failures

1. Check environment variables: `npm run env:validate`
2. Clean and rebuild: `npm run clean && npm run build`
3. Verify Node version: `node -v` (should be >= 18.17.1)
4. Clear npm cache: `npm cache clean --force`

### Staging Issues

1. Check Docker is running: `docker version`
2. View logs: `npm run staging:logs`
3. Restart containers: `npm run staging:restart`
4. Clean and rebuild: `npm run staging:clean && npm run staging:up`

### Type Errors

1. Rebuild Astro types: Delete `.astro` folder and run `npm run dev`
2. Check `tsconfig.json` paths match actual file structure
3. Ensure all imports use correct path aliases

### ESLint Errors

- Most issues can be auto-fixed: `npm run lint:fix`
- For persistent issues, check `eslint.config.js` rules
- Console logs should use structured logging in production code
