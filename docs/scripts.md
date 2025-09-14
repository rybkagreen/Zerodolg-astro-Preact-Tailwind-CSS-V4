# Project Scripts Documentation

This document provides detailed information about all available npm scripts in the ZeroDolg Astro project.

## Development Scripts

### `dev`
```bash
npm run dev
```
Starts the Astro development server with hot-reloading enabled. This is the primary command for local development.

### `build`
```bash
npm run build
```
Builds the production version of the website. This command:
1. Cleans previous build artifacts
2. Runs TypeScript type checking
3. Runs ESLint to check for code quality issues
4. Builds the Astro site
5. Shows a success message upon completion

### `build:prod`
```bash
npm run build:prod
```
Builds the production version using the production configuration file (`astro.config.prod.mjs`).

### `preview`
```bash
npm run preview
```
Starts a local server to preview the production build. Useful for testing the built site before deployment.

### `astro`
```bash
npm run astro
```
Runs Astro CLI commands directly. Useful for generating files, checking the configuration, etc.

## Code Quality Scripts

### `lint`
```bash
npm run lint
```
Runs ESLint on all JavaScript, TypeScript, TSX, and Astro files to check for code quality issues.

### `lint:fix`
```bash
npm run lint:fix
```
Runs ESLint and automatically fixes any auto-fixable issues in JavaScript, TypeScript, TSX, and Astro files.

### `type-check`
```bash
npm run type-check
```
Runs the TypeScript compiler in "no emit" mode to check for type errors without generating output files.

## Documentation Scripts

### `docs:generate`
```bash
npm run docs:generate
```
Runs the component documentation generator script to automatically create documentation from JSDoc comments in components.

### `docs:build`
```bash
npm run docs:build
```
Generates component documentation and then builds the site. Useful when documentation changes need to be included in the build.

## Build Lifecycle Scripts

These scripts run automatically during the build process and should not be called directly.

### `prebuild`
```bash
npm run prebuild
```
Runs before the build script:
1. Cleans build artifacts
2. Runs TypeScript type checking
3. Runs ESLint

### `postbuild`
```bash
npm run postbuild
```
Runs after the build script and shows a success message.

### `clean`
```bash
npm run clean
```
Removes the `dist` directory and `.astro` cache directory.

## Git Hooks Setup

### `prepare`
```bash
npm run prepare
```
Sets up Husky git hooks. This runs automatically after `npm install`.

## Husky Git Hooks

### pre-commit
Automatically runs when you commit changes:
1. Executes `lint-staged` to check and fix code style issues in staged files
2. Prevents commit if there are unfixable issues

## Recommended Development Workflow

1. Start development server:
   ```bash
   npm run dev
   ```

2. Make code changes

3. Check for type errors:
   ```bash
   npm run type-check
   ```

4. Check code quality:
   ```bash
   npm run lint
   ```

5. Automatically fix issues:
   ```bash
   npm run lint:fix
   ```

6. Build for production:
   ```bash
   npm run build
   ```

7. Preview production build:
   ```bash
   npm run preview
   ```

This workflow ensures code quality is maintained throughout development and that the final build is clean and error-free.