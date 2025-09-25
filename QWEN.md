# Qwen Code Configuration for ZeroDolg Astro Website

## Project Overview

ZeroDolg Astro Website is a corporate website for a legal company specializing in bankruptcy services for individuals. The project is built using Astro v5.13.7 as a static site generator with Preact for interactive components. The codebase is organized according to Feature-Sliced Design principles, emphasizing maintainability and scalability.

Key technologies used:
- **Astro** - Static Site Generator (v5.13.7)
- **Preact** - Lightweight alternative to React (v10.27.1)
- **TypeScript** - Type safety (v5.9.2)
- **Tailwind CSS** - Utility-first CSS framework (v4)
- **Alibaba CMS** - Cloud-based content management system
- **CSS** - Modern CSS with custom properties following ITCSS architecture
- **Vitest** - Testing framework (v3.2.4)
- **Puppeteer** - End-to-end testing (v24.22.3)
- **Model Context Protocol (MCP)** - Enhanced AI capabilities

## Project Architecture

### Core Principles
- **Feature-Sliced Design** - Code organized by business features and layers
- **Islands Architecture** - Interactive components only where needed
- **Static Generation** - Pre-rendered HTML for maximum performance
- **Progressive Enhancement** - Site works without JavaScript
- **Component-Based** - Modular and reusable architecture

### Directory Structure
```
zerodolg-astro/
├── .github/                    # GitHub-specific files
│   └── workflows/              # GitHub Actions workflows
│       └── ci.yml              # CI/CD pipeline
├── .husky/                     # Git hooks configuration
├── .qwen/                      # Qwen AI assistant configuration
├── .vscode/                    # VS Code configuration
├── docs/                       # Documentation files
│   ├── analysis/               # Analysis reports
│   ├── blog/                   # Blog content
│   ├── migrations/             # Migration guides
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

## Building and Running

### Development Commands
- `npm run dev` - Start local development server
- `npm run build` - Build project for production
- `npm run build:prod` - Build project with production optimizations
- `npm run preview` - Preview built site locally
- `npm run lint` - Check code with ESLint
- `npm run lint:fix` - Automatically fix code issues
- `npm run type-check` - Check TypeScript types
- `npm run test` - Run tests with Vitest
- `npm run test:coverage` - Run tests with coverage report
- `npm run clean` - Clean compiled files
- `npm run test:e2e` - Run end-to-end tests with Puppeteer
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI interface
- `npm run deploy` - Deploy the application
- `npm run maintenance:audit` - Audit project dependencies
- `npm run maintenance:lighthouse` - Run Lighthouse audit
- `npm run mcp:info` - Get info about MCP configuration

### Project Configuration
The project requires environment variables for Alibaba CMS integration:
```
# Alibaba CMS
CMS_API_BASE=https://your-cms-endpoint.alibabacloud.com
CMS_API_KEY=your-api-key-here
```

## Development Conventions

### Styling Architecture
- **ITCSS** - Inverted Triangle CSS for organizing styles
- **BEM Methodology** - Block, Element, Modifier for CSS class naming
- **Tailwind CSS v4** - Utility-first CSS framework for rapid development
- **Mobile First** - Design starting with mobile devices

### Code Quality
- TypeScript with strict mode enabled
- ESLint for code linting
- Prettier for code formatting
- Husky for Git hooks
- Lint-staged for pre-commit checks

### TypeScript Path Aliases
- `@core/*` - Maps to `src/core/*`
- `@features/*` - Maps to `src/features/*`
- `@shared/*` - Maps to `src/shared/*`
- `@widgets/*` - Maps to `src/widgets/*`
- `@styles/*` - Maps to `src/styles/*`
- `@types/*` - Maps to `src/core/types/*`
- `@utils/*` - Maps to `src/shared/utils/*`

## Project Status

The project is fully completed and production-ready:
- All pages implemented and tested
- SEO fully optimized with robots.txt and sitemap.xml
- All interactive components working correctly
- Forms validated and submitting data properly
- Modal system functioning correctly
- Analytics integrated and working
- Performance optimized
- Design adapted for all devices
- Tailwind CSS v4 migration completed

## Key Integrations

### SEO and Analytics
- Sitemap generation via `@astrojs/sitemap`
- Robots.txt configuration via `astro-robots-txt`
- Analytics integration for tracking

### Model Context Protocol (MCP)
- MCP integration via `astro-mcp` for enhanced AI capabilities

### Testing
- Vitest for unit and integration testing
- Puppeteer for end-to-end testing
- Testing Library for component testing
- Comprehensive test coverage with coverage reports

## Special Considerations

1. **No Inline Styles**: Never use `style="..."` or `style={...}` attributes
2. **No !important**: Never use `!important` in CSS
3. **Progressive Enhancement**: Must work without JavaScript
4. **Semantic HTML**: Use proper HTML5 semantic elements
5. **ARIA Labels**: For all interactive elements
6. **Alt Text**: For all images

## Development Workflow

1. **Before Making Changes**:
   - Check existing implementations
   - Review similar components
   - Verify design requirements
   - Check responsive behavior

2. **During Development**:
   - Follow existing patterns
   - Write semantic HTML first
   - Add styling through CSS classes
   - Implement interactivity last
   - Test incrementally

3. **After Changes**:
   - Run build: `npm run build`
   - Test all viewports
   - Verify accessibility
   - Update documentation
   - Commit with descriptive message