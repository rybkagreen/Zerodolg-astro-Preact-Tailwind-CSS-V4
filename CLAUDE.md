# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

ZeroDolg Astro Website is a corporate website for a legal company specializing
in bankruptcy services for individuals. The project uses Astro v5.13.7 as a
static site generator with Preact for interactive components, organized
according to Feature-Sliced Design principles. The project now emphasizes
Qwen Code as the primary AI assistant in the development workflow.

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
└── styles/             # Tailwind CSS v4 styles
```

### Key Architectural Principles

- **Feature-Sliced Design**: Code organized by business features and layers
- **Islands Architecture**: Interactive components are isolated and loaded only when needed
- **Static Generation**: HTML pre-rendered for maximum performance
- **Progressive Enhancement**: Site works without JavaScript
- **Mobile First**: Design starting with mobile devices
- **Type Safety**: Strict TypeScript checking throughout

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

- **Tailwind CSS v4** - Modern utility-first framework with new CSS-based configuration
- **Mobile First** - Design approach starting with mobile devices
- **Component-based** - Reusable UI components with consistent styling

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
- Security-focused rules (no unsafe eval, proper CSP)

### Component Patterns

- **Astro Components**: Static HTML with minimal JavaScript
- **Preact Islands**: Interactive components only where needed
- **Feature-Sliced Design**: Organized by business functionality
- **Semantic HTML**: Proper HTML5 elements and ARIA labels
- **Accessibility First**: WCAG 2.2 compliance from the start

## Key Integrations

### SEO & Analytics

- `@astrojs/sitemap` for sitemap generation
- `astro-robots-txt` for robots.txt configuration
- Google Analytics and Yandex Metrika integration

### Model Context Protocol (MCP)

- `astro-mcp` integration for enhanced AI capabilities
- MCP-specific commands: `mcp:info`, `mcp:puppeteer`, `mcp:server`

### Security Headers

- Content Security Policy (CSP) via middleware
- X-Frame-Options, X-Content-Type-Options headers
- Referrer-Policy and Permissions-Policy headers

### Environment Variables

Project requires environment variables for full functionality:

```env
# Site Configuration
PUBLIC_SITE_URL=https://zerodolg.ru
PUBLIC_SITE_PHONE=+7 (905) 577-33-87
PUBLIC_SITE_EMAIL=info@zerodolg.ru

# Analytics
PUBLIC_GA_ID=G-XXXXXXXXXX
PUBLIC_YM_ID=XXXXXXXX

# Bitrix24 Integration
BITRIX24_WEBHOOK_URL=https://your-domain.bitrix24.ru/rest/1/webhook_key/

# Qwen Code (optional)
QWEN_API_KEY=your-qwen-api-key

# Development
NODE_ENV=development # development | production
```

## Development Workflow

### Before Making Changes

1. Check existing implementations and patterns
2. Review similar components for consistency
3. Verify design requirements and responsive behavior
4. Check TypeScript path aliases usage
5. Consider security implications of changes
6. Think about accessibility of new features

### During Development

1. Follow existing Feature-Sliced Design patterns
2. Write semantic HTML first, then add styling
3. Implement interactivity last (Progressive Enhancement)
4. Test incrementally across different viewports
5. Keep accessibility in mind (ARIA, keyboard navigation)
6. Prioritize security (CSP, input validation, XSS prevention)

### After Changes

1. Run `npm run build` to verify compilation
2. Test all interactive components
3. Verify accessibility and responsive design
4. Run `npm run test` to ensure no regressions
5. Check that security headers are still properly configured
6. Validate that new code follows TypeScript strict mode

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

## 2025 Modern Practices

### Security (SAST)

- **Semgrep** - Static Analysis Security Testing
- **TruffleHog** - Secrets scanning
- **Content Security Policy** - Prevention of XSS attacks
- **Subresource Integrity** - Verification of external resources

### Performance

- **Core Web Vitals 2025**:
  - LCP < 1.0s
  - FID < 75ms
  - CLS < 0.05
- **Image optimization** - WebP/AVIF formats with proper loading
- **Bundle optimization** - Tree-shaking and code splitting

### Accessibility

- **WCAG 2.2/3.0 compliance** - From the start of development
- **ARIA attributes** - Proper use for dynamic content
- **Keyboard navigation** - Full functionality without mouse
- **Screen reader support** - Testing with assistive technologies

### Sustainability

- **Energy-efficient code** - Minimized resource usage
- **Optimized assets** - Reduced data transmission
- **Efficient caching** - Reduced server requests

## AI Integration Guidelines

### Working with Qwen Code (Primary AI Assistant)

1. **Prompts for Qwen Code**:
   - Specify "use TypeScript strict mode" in prompts
   - Request "Tailwind CSS v4 syntax" for styling
   - Ask for "accessible components with proper ARIA labels"
   - Request "secure code with XSS prevention"

2. **Review Process**:
   - Always review AI-generated code for security issues
   - Verify TypeScript strict mode compliance
   - Check for accessibility best practices
   - Ensure performance considerations are met

### Claude AI Role (Secondary Assistant)

1. **Specialized Tasks for Claude**:
   - Complex architectural decisions
   - Detailed security analysis
   - Performance optimization strategies
   - Code review and improvement suggestions

2. **Collaboration with Qwen Code**:
   - Use Claude for reviewing Qwen Code outputs
   - Get second opinion on complex problems
   - Analyze security implications of generated code

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
- Core Web Vitals 2025 optimization

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

## Use Cases for Claude AI

### Architecture & Design

1. Analyzing complex refactoring scenarios
2. Suggesting architectural improvements
3. Proposing solutions to technical debt
4. Reviewing security implementations

### Code Quality & Security

1. Deep security analysis of authentication flows
2. Performance optimization recommendations
3. Advanced TypeScript type design
4. Accessibility compliance verification

### Best Practices for Claude AI Integration

1. Provide full context of the problem
2. Include relevant code snippets
3. Request specific types of solutions
4. Ask for alternative approaches when needed
5. Always verify Claude's suggestions for security implications
