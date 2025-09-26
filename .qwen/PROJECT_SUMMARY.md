# Project Summary

## Overall Goal

Create and maintain a properly configured Qwen Code environment for the
zerodolg-astro project, a bankruptcy legal services website built with Astro
v5.13.5, fixing configuration issues and ensuring all extensions work correctly.

## Key Knowledge

- **Project**: ZeroDolg Astro Website (bankruptcy legal services company)
- **Technology Stack**: Astro v5.13.5, Preact v10.27.1, TypeScript v5.9.2, CSS
  with custom properties
- **Architecture**: Islands Architecture for interactive components, static
  generation, progressive enhancement
- **Language**: Russian for content and UI, English for code and comments
- **File Naming**: PascalCase for components, kebab-case for pages, BEM
  methodology for CSS classes
- **Key Prohibitions**: No inline styles, no !important in CSS, only CSS classes
  for styling
- **Directory Structure**: Organized scripts by function (build, deploy, test,
  maintenance), tools in separate directory, documentation centralized in docs/,
  ITCSS architecture for styles, components in /src/components/, content
  collections in /src/content/
- **Extensions**: All extensions need proper qwen-extension.json and command
  files with required 'prompt' fields

## Recent Actions

- [DONE] Removed unexpected files (CHEATSHEET.md and README.md) from extensions
  directory
- [DONE] Created a new, properly formatted QWEN.md configuration file without
  import error messages
- [DONE] Verified that extension directories already had proper
  qwen-extension.json files
- [DONE] Updated all command TOML files across 4 extensions (astro-dev,
  deps-manager, git-helper, perf-check) with required 'prompt' field
- [DONE] Fixed validation errors for all command files that were missing the
  'prompt' field

## Current Plan

- [DONE] Fix extension command validation errors
- [DONE] Clean up configuration files
- [DONE] Ensure all Qwen Code extensions work properly
- [DONE] Update configuration files with latest project structure

The Qwen Code environment is now properly configured for the zerodolg-astro
project with all extensions functioning correctly and no validation errors.

---

## Summary Metadata

**Update time**: 2025-09-24T07:01:49.083Z
