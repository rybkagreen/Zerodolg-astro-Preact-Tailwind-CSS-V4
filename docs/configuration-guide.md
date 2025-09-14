# ZeroDolg Astro Project Configuration Guide

This document provides a comprehensive overview of the configuration and optimization of the ZeroDolg Astro project, focusing on package management, scripts, and development workflow.

## Project Overview

The ZeroDolg Astro project is a modern website built with Astro.js, utilizing Preact for interactive components. The project follows best practices for performance, maintainability, and developer experience.

## Package.json Optimization Summary

### Dependencies Cleanup

We've optimized the project dependencies by removing unused packages and updating to the latest stable versions.

#### Removed Dependencies
- **fs-extra**: Removed as it was only used in development scripts and not in core application code

#### Updated Dependencies
All dependencies have been updated to their latest stable versions:
- `astro`: ^5.13.7
- `@astrojs/preact`: ^4.1.1
- `preact`: ^10.27.1
- All development dependencies updated accordingly

#### Added Dependencies
- **@types/node**: Provides TypeScript definitions for Node.js APIs
- **husky**: Git hooks management for automated code quality checks
- **lint-staged**: Runs linters on git staged files
- **rimraf**: Cross-platform file deletion utility for clean builds

## Enhanced Scripts

### New Build Process
The build process has been enhanced with automated checks and cleanup:

1. **Pre-build phase**:
   - Clean previous build artifacts
   - Run TypeScript type checking
   - Run ESLint for code quality

2. **Build phase**:
   - Execute Astro build process

3. **Post-build phase**:
   - Show success message

### Development Scripts
- `dev`: Start development server
- `build`: Production build with quality checks
- `build:prod`: Production build with production config
- `preview`: Preview production build

### Code Quality Scripts
- `lint`: Check code quality
- `lint:fix`: Automatically fix code quality issues
- `type-check`: TypeScript type checking

### Documentation Scripts
- `docs:generate`: Generate component documentation
- `docs:build`: Generate docs and build site

### Git Hooks
- **pre-commit**: Automatically runs lint-staged to check code quality

## Configuration Files

### ESLint Configuration
Located in `eslint.config.js`, the ESLint configuration:
- Extends recommended ESLint and TypeScript ESLint configs
- Includes specific rules for Astro files
- Provides appropriate warning levels for different issue types

### TypeScript Configuration
Located in `tsconfig.json`, the TypeScript configuration:
- Extends Astro's strict TypeScript configuration
- Sets JSX to React-jsx mode with Preact as import source

### Astro Configuration
Located in `astro.config.mjs`, the Astro configuration:
- Integrates Preact for interactive components
- Enables performance optimizations
- Configures build settings for minification and optimization

## Development Workflow

### Daily Development
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Make code changes in the `src` directory

3. View changes in real-time in the browser

### Code Quality Assurance
1. Check for type errors:
   ```bash
   npm run type-check
   ```

2. Check code quality:
   ```bash
   npm run lint
   ```

3. Automatically fix issues:
   ```bash
   npm run lint:fix
   ```

### Before Committing
1. Stage your changes:
   ```bash
   git add .
   ```

2. Commit your changes:
   ```bash
   git commit -m "Your commit message"
   ```

3. Husky will automatically run lint-staged to check code quality

### Production Build
1. Run the production build:
   ```bash
   npm run build
   ```

2. Preview the production build:
   ```bash
   npm run preview
   ```

## Best Practices

### Dependency Management
- Regularly update dependencies to get latest features and security patches
- Remove unused dependencies to reduce bundle size
- Use specific version ranges to balance stability and updates

### Code Quality
- Follow ESLint rules for consistent code style
- Use TypeScript for type safety
- Write comprehensive JSDoc comments for components

### Git Workflow
- Use descriptive commit messages
- Let Husky and lint-staged ensure code quality
- Keep commits focused on single changes

### Performance Optimization
- Leverage Astro's island architecture
- Use Preact for lightweight interactive components
- Optimize images and assets
- Minimize CSS and JavaScript bundles

## Project Structure

```
zerodolg-astro/
├── .astro/                 # Astro cache
├── dist/                   # Production build output
├── docs/                   # Project documentation
├── public/                 # Static assets
├── scripts/                # Utility scripts
├── src/                    # Source code
│   ├── components/         # UI components
│   ├── content/            # Content collections
│   ├── data/               # Data files
│   ├── layouts/            # Page layouts
│   ├── pages/              # Page routes
│   └── styles/             # CSS styles
├── package.json            # Project configuration
├── astro.config.mjs        # Astro configuration
├── tsconfig.json           # TypeScript configuration
└── eslint.config.js        # ESLint configuration
```

## Troubleshooting

### Build Issues
1. Clean the build:
   ```bash
   npm run clean
   ```

2. Check for type errors:
   ```bash
   npm run type-check
   ```

3. Check for linting issues:
   ```bash
   npm run lint
   ```

### Git Hooks Issues
1. Reinstall Husky:
   ```bash
   npm run prepare
   ```

2. Check lint-staged configuration in package.json

### Dependency Issues
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Remove node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## Future Improvements

### Planned Enhancements
1. Add automated testing framework
2. Implement CI/CD pipeline
3. Add performance monitoring
4. Enhance documentation generation

### Monitoring
1. Regular dependency updates
2. Performance benchmarking
3. Security audits
4. Bundle size analysis

This configuration guide ensures the ZeroDolg Astro project maintains high code quality, optimal performance, and an efficient development workflow.