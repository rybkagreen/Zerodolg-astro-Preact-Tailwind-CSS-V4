# Project Structure

This document outlines the organized structure of the ZeroDolg Astro project, following modern development best practices.

## 📁 Directory Structure

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
├── tools/                      # Standalone utility tools
└── Configuration Files         # Root-level config files
```

## 📋 Scripts Organization

### Build Scripts (`scripts/build/`)
- `build-production.js` - Complete production build with optimizations

### Deployment Scripts (`scripts/deploy/`)
- `deploy-complete.js` - Full deployment process
- `deployment-checklist-complete.js` - Pre-deployment validation
- `post-build-verification.js` - Build verification
- `rollback.js` - Deployment rollback
- `create-backup.js` - Backup creation

### Development Scripts (`scripts/dev/`)
- `validate-env.js` - Environment validation
- `setup-env.js` - Environment setup

### Maintenance Scripts (`scripts/maintenance/`)
- `audit-deps.cjs` - Dependency auditing
- `optimize-images.js` - Image optimization
- `lighthouse-audit.js` - Performance auditing
- `seo-monitor.cjs` - SEO monitoring

### Test Scripts (`scripts/test/`)
- `run-tests-with-coverage.js` - Test runner with coverage
- `run-puppeteer-tests.js` - E2E tests
- `test-env-validation.js` - Environment testing

## 🛠️ Tools Directory (`tools/`)

Standalone utility tools that can be run independently:

- `compare-sites.js` - Compare production vs local site
- `diagnose-local-styles.js` - CSS diagnostic tool
- `debug-css-loading.js` - CSS loading debugger
- `mcp-puppeteer.js` - MCP Puppeteer utilities
- `demo-mcp-puppeteer.js` - MCP demonstrations

## 📚 Documentation (`docs/`)

### Optimization (`docs/optimization/`)
- `OPTIMIZATION_CHECKLIST.md` - Step-by-step optimization guide

### Setup (`docs/setup/`)
- Configuration and setup documentation

## 🚀 Available NPM Scripts

### Core Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:prod` - Build with production config
- `npm run build:production` - Full production build with optimizations
- `npm run preview` - Preview built site

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Testing
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run test:coverage:report` - Generate coverage report
- `npm run test:e2e` - Run E2E tests
- `npm run test:env` - Test environment validation

### Environment
- `npm run env:validate` - Validate environment variables
- `npm run env:setup` - Setup environment

### Deployment
- `npm run deploy` - Deploy to production
- `npm run deploy:checklist` - Run deployment checklist
- `npm run deploy:verify` - Verify deployment
- `npm run deploy:rollback` - Rollback deployment
- `npm run deploy:backup` - Create backup

### Maintenance
- `npm run maintenance:audit` - Audit dependencies
- `npm run maintenance:optimize-images` - Optimize images
- `npm run maintenance:lighthouse` - Run Lighthouse audit

### Tools
- `npm run tools:compare-sites` - Compare sites
- `npm run tools:diagnose-css` - Diagnose CSS issues
- `npm run tools:debug-css` - Debug CSS loading

### MCP (Multi-Channel Publisher)
- `npm run mcp:info` - Show MCP information
- `npm run mcp:puppeteer` - Run MCP Puppeteer
- `npm run mcp:server` - Start MCP server
- `npm run mcp:demo` - Run MCP demo

## 🎯 Best Practices Implemented

### 1. **Separation of Concerns**
- Scripts are organized by function (build, deploy, test, maintenance)
- Tools are separated from scripts
- Documentation is centralized

### 2. **Clear Naming Conventions**
- Scripts use descriptive names indicating their purpose
- NPM scripts are namespaced (e.g., `test:`, `deploy:`, `maintenance:`)

### 3. **Environment Management**
- Environment validation scripts
- Proper `.env` handling and validation

### 4. **CI/CD Ready**
- GitHub Actions workflow configured
- Automated testing and building
- Lighthouse performance auditing

### 5. **Documentation First**
- Clear project structure documentation
- Optimization checklists and guides
- Setup instructions

### 6. **Security Focused**
- Environment variable validation
- Security checks in build process
- Proper `.gitignore` configuration

### 7. **Performance Oriented**
- Image optimization scripts
- Lighthouse auditing
- Build optimization

## 🔧 Configuration Files

All configuration files remain in the project root for tool compatibility:
- `package.json` - Project configuration and dependencies
- `astro.config.mjs` - Astro configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration
- `jest.config.cjs` - Jest testing configuration
- `tailwind.config.mjs` - Tailwind CSS configuration
- `postcss.config.cjs` - PostCSS configuration

## 📈 Migration Benefits

1. **Better Organization** - Easy to find and maintain scripts
2. **Scalability** - Clear structure for adding new scripts
3. **Team Collaboration** - Obvious where to put new files
4. **CI/CD Integration** - Organized structure works well with automation
5. **Documentation** - Self-documenting structure with clear purposes
6. **Maintenance** - Easy to identify and update related functionality

## 🚦 Getting Started

1. **Development**: `npm run dev`
2. **Build**: `npm run build:production`
3. **Test**: `npm run test`
4. **Deploy**: `npm run deploy:checklist && npm run deploy`
5. **Maintain**: `npm run maintenance:audit`

For more detailed information, see the documentation in the `docs/` directory.