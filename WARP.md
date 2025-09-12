# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a legal services website for personal bankruptcy assistance (zerodolg.ru), built with Astro and migrated from a Handlebars-based system. The site uses Astro's Islands architecture with Preact for client-side interactivity.

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Start development server (runs on localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type checking (TypeScript validation)
npm run astro check

# Type check and then build (recommended for CI/CD)
npm run astro check && npm run build

# Access Astro CLI
npm run astro -- --help
```

### Component Migration Tools
```bash
# Migrate Handlebars components to Astro (custom migration script)
node scripts/migrate-component.mjs

# Compare performance metrics (old vs new)
node scripts/compare-metrics.cjs
```

## Architecture Overview

### Component Structure
The project follows a clear component architecture:

- **`src/components/static/`** - Server-only components (Header, Footer, CTA)
- **`src/components/islands/`** - Interactive components using Astro Islands (Calculator, Timeline, Reviews)
- **`src/components/forms/`** - Form components with client-side validation
- **`src/components/dynamic/`** - Client-side modals and managers
- **`src/components/sections/`** - Page sections that combine static and island components

### Page Structure
Single-page application with sections:
```astro
<Layout title="...">
  <Header />
  <main>
    <Hero />
    <Stats />
    <Calculator />
    <Benefits />
    <Timeline />
    <Reviews />
    <TeamInteractive />
    <LeadMagnets />
    <Faq />
    <Cta />
  </main>
  <Footer />
</Layout>
```

### Data Management
- **`src/content/`** - Astro Content Collections (blog, reviews, team)
- **`src/data/`** - JSON data files (site.json, calculator.json)
- Content collections use Zod schemas for type safety

### Styling Architecture
Uses ITCSS (Inverted Triangle CSS) methodology with BEM naming:
```
src/styles/
├── main.css                 # Single entry point
├── 00-settings/            # CSS variables
├── 01-generic/             # Resets
├── 02-elements/            # Base elements
├── 03-components/          # BEM components
├── 04-sections/            # Page sections
└── 05-utilities/           # Helper classes
```

## Client-Side Interactivity

### Astro Islands Pattern
Interactive components use the client:* directives:
- `client:load` - Load immediately
- `client:visible` - Load when element enters viewport
- `client:idle` - Load when browser is idle

Example:
```astro
<ModalManager client:load />
<ScrollAnimations client:load once={true} offset={100} duration={800} />
<LeadMagnetsLogic client:visible />
```

### Form Handling
- All forms submit to `/api/form.ts` API route
- Client-side validation with FormLogic.tsx component
- Phone/currency input masking
- Integrates with Bitrix24 CRM webhook

## Type Safety

### TypeScript Configuration
- Uses Astro's strict TypeScript preset
- JSX configured for Preact integration
- Type checking with `astro check` command

### Content Collections
All content is type-safe using Zod schemas:
```typescript
const reviews = defineCollection({
  type: 'data',
  schema: z.object({
    author: z.string(),
    rating: z.number().min(1).max(5),
    // ...
  })
});
```

## Development Guidelines

### Styling Rules
- **NO inline styles** - All removed during migration
- Use BEM methodology: `block__element--modifier`
- CSS classes only in `src/styles/` directory
- State classes: `.is-active`, `.is-open`, `.is-visible`

### Component Guidelines
- Static components in `/static/` for server-only rendering
- Interactive components in `/islands/` with Preact
- Use TypeScript interfaces for component props
- Follow existing naming conventions (PascalCase for components)

### Performance Optimizations
- Astro Islands reduce JavaScript bundle size (12KB vs 180KB from legacy)
- Partial hydration - only interactive parts load JS
- Static generation with `output: 'static'`

## Testing and Quality

### Manual Testing Checklist
- Navigation anchor links functionality
- Form submissions to Bitrix24
- Modal interactions
- Mobile responsiveness (375px to 1920px)
- Lighthouse scores (target: >90)

### Browser Testing
- Desktop: Chrome, Firefox, Safari, Edge
- Mobile: iOS Safari, Chrome Mobile
- Tablet: iPad, Android tablets

## Environment Configuration

### Required Environment Variables
```bash
BITRIX24_WEBHOOK_URL=https://zerodolg.bitrix24.ru/rest/1/sn1lo90na6t13v1d/
```

### Build Configuration
- TypeScript strict mode enabled
- Preact integration configured
- Inline stylesheets set to 'auto'
- Dev toolbar enabled for development

## Migration Notes

This project was migrated from a Vite + Handlebars setup. Key improvements:
- 75% smaller bundle size
- 56x faster build times
- Lighthouse Performance score: 85 → 97
- Development speed increased 4-6x

The migration scripts in `/scripts/` can help convert remaining Handlebars components if needed.

## Content Management

### Adding New Content
- Blog posts: Add `.md` files to `src/content/blog/`
- Reviews: Add `.json` files to `src/content/reviews/`
- Team members: Add `.json` files to `src/content/team/`

### Site Configuration
Global site data in `src/data/site.json` including:
- Contact information
- Company details
- Social media links
- Analytics IDs

## Common Tasks

### Adding a New Section
1. Create component in appropriate `/components/` subdirectory
2. Add styles to `src/styles/04-sections/_newsection.css`
3. Import style in `src/styles/main.css`
4. Add to main page in `src/pages/index.astro`

### Adding Interactivity
1. Create island component in `/components/islands/`
2. Use Preact hooks for state management
3. Add client directive when including in parent component
4. Keep TypeScript interfaces for props

### Form Integration
Forms automatically submit to the Bitrix24 API. To add new form types:
1. Update form type validation in `src/pages/api/form.ts`
2. Add new form type to titles mapping
3. Configure any custom Bitrix24 fields needed
