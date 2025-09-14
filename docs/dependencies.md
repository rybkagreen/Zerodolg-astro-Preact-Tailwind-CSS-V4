# Project Dependencies Documentation

This document provides detailed information about all dependencies and devDependencies used in the ZeroDolg Astro project.

## Dependencies

These are packages required for the application to run in production.

### `@astrojs/preact`
- **Version**: ^4.1.1
- **Purpose**: Astro integration for Preact
- **Usage**: Enables Preact component support in Astro pages
- **Features**:
  - Server-side rendering of Preact components
  - Client-side hydration for interactive components
  - Island architecture support

### `astro`
- **Version**: ^5.13.7
- **Purpose**: The web framework for content-driven websites
- **Usage**: Core framework for building the website
- **Features**:
  - File-based routing
  - Component islands architecture
  - Built-in optimizations
  - Static site generation

### `preact`
- **Version**: ^10.27.1
- **Purpose**: Fast 3kB alternative to React with the same modern API
- **Usage**: Building interactive UI components
- **Features**:
  - Lightweight alternative to React
  - Same modern API (Hooks, Context, etc.)
  - Fast rendering performance
  - Small bundle size

## DevDependencies

These are packages used only during development and not required in production.

### `@astrojs/check`
- **Version**: ^0.9.4
- **Purpose**: Type checking for Astro projects
- **Usage**: Validates TypeScript types in Astro files

### `@eslint/js`
- **Version**: ^9.35.0
- **Purpose**: ESLint's shareable config for JavaScript
- **Usage**: Base ESLint configuration

### `@types/node`
- **Version**: ^22.10.10
- **Purpose**: TypeScript definitions for Node.js
- **Usage**: Provides type information for Node.js built-in modules

### `@typescript-eslint/eslint-plugin`
- **Version**: ^8.43.0
- **Purpose**: ESLint plugin for TypeScript
- **Usage**: TypeScript-specific linting rules

### `@typescript-eslint/parser`
- **Version**: ^8.43.0
- **Purpose**: TypeScript parser for ESLint
- **Usage**: Parses TypeScript code for ESLint

### `astro-eslint-parser`
- **Version**: ^1.2.2
- **Purpose**: ESLint parser for Astro files
- **Usage**: Parses Astro component files for ESLint

### `eslint`
- **Version**: ^9.35.0
- **Purpose**: Pluggable JavaScript linter
- **Usage**: Code quality checking and formatting enforcement

### `eslint-plugin-astro`
- **Version**: ^1.3.1
- **Purpose**: ESLint plugin for Astro
- **Usage**: Astro-specific linting rules

### `globals`
- **Version**: ^16.4.0
- **Purpose**: Global identifiers from different JavaScript environments
- **Usage**: Provides global variable definitions for linting

### `husky`
- **Version**: ^9.1.7
- **Purpose**: Git hooks made easy
- **Usage**: Manages Git hooks for code quality checks

### `lint-staged`
- **Version**: ^15.4.3
- **Purpose**: Run linters on git staged files
- **Usage**: Ensures code quality before commits

### `lightningcss`
- **Version**: ^1.29.3
- **Purpose**: Extremely fast CSS parser, transformer, and minifier
- **Usage**: CSS optimization in Astro builds

### `rimraf`
- **Version**: ^6.0.1
- **Purpose**: Cross-platform file deletion utility
- **Usage**: Clean build artifacts consistently across platforms

### `terser`
- **Version**: ^5.39.0
- **Purpose**: JavaScript minifier
- **Usage**: Minifies JavaScript bundles in production builds

### `typescript`
- **Version**: ^5.9.2
- **Purpose**: TypeScript language server
- **Usage**: Type checking and compilation

### `typescript-eslint`
- **Version**: ^8.43.0
- **Purpose**: Monorepo for all the tooling which enables ESLint to support TypeScript
- **Usage**: Core TypeScript-ESLint tooling

## Dependency Management Best Practices

### Versioning Strategy
- All dependencies use caret (^) versioning to allow for minor updates
- Major versions are pinned to prevent breaking changes

### Regular Updates
- Dependencies should be updated regularly to:
  - Get the latest features
  - Apply security patches
  - Improve performance
  - Fix bugs

### Update Process
1. Check for outdated packages:
   ```bash
   npm outdated
   ```

2. Update packages to latest versions:
   ```bash
   npm update
   ```

3. For major version updates, check release notes for breaking changes

### Security Considerations
- Regularly audit dependencies:
  ```bash
  npm audit
  ```

- Fix security vulnerabilities:
  ```bash
  npm audit fix
  ```

### Bundle Size Optimization
- Prefer lightweight alternatives (e.g., Preact instead of React)
- Remove unused dependencies
- Use tree-shaking to eliminate unused code

## Migration from fs-extra

Previously, the project used `fs-extra` for file system operations in development scripts. This dependency was removed because:

1. It was only used in development scripts, not in the core application
2. Native Node.js `fs` module provides sufficient functionality for most use cases
3. Reducing dependencies simplifies the project and reduces potential security vulnerabilities

Scripts that require `fs-extra` functionality should install it locally when needed:
```bash
npm install --save-dev fs-extra
```

## Future Considerations

### Potential Additions
- `@types/*` packages for any additional libraries that require type definitions
- Testing frameworks if automated testing is implemented
- Additional linting plugins for specific use cases

### Monitoring
- Regular dependency audits
- Performance impact assessments after major updates
- Compatibility testing with Node.js version updates

This documentation should be updated whenever dependencies are added, removed, or significantly updated.