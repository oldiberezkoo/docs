# AGENTS.md - Coding Guidelines for Astro Docs

This file contains essential guidelines for AI agents working in the Astro Docs repository.

## Build/Lint/Format Commands

```bash
# Development
pnpm run dev              # Start dev server
pnpm run build            # Build for production
pnpm run preview          # Preview production build

# Type Checking
pnpm run check            # Run Astro type checking

# Linting
pnpm run lint:eslint      # Run ESLint
pnpm run lint:linkcheck   # Check broken links (needs build first)
pnpm run lint:linkcheck:nobuild  # Check links without build
pnpm run lint:slugcheck   # Validate URL slugs
pnpm run lint:ja          # Lint Japanese translations

# Formatting
pnpm run format           # Format all code with Prettier
pnpm run format:ci        # Format code + imports
```

**Note:** This project has no test runner. Testing is done via linting and type checking.

## Package Manager

Always use **pnpm** (required by package.json):
```bash
pnpm install <package>
```

## Code Style

### Indentation
- **Use tabs** for `.ts`, `.js`, `.mjs`, `.mts`, `.astro` files
- **Use spaces** for `.json`, `.md`, `.mdx`, `.yml`, `.yaml`, `.toml` files
- Tab width: 2 spaces equivalent

### Formatting (Prettier)
```json
{
  "printWidth": 100,
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "useTabs": true
}
```

### TypeScript Guidelines

**Imports:**
```typescript
// External imports first
import { defineConfig } from 'astro/config';

// Internal imports after blank line
import { sidebar } from './astro.sidebar';
```

**Types:**
- Use explicit return types on exported functions
- Prefer `type` over `interface` for object shapes
- Use Zod schemas for content validation (see `src/content.config.ts`)

```typescript
// Good
export function getLangFromSlug(slug: string): string {
  return slug.split('/')[0];
}

// Good - Zod schema
export const baseSchema = z.object({
  type: z.literal('base').optional().default('base'),
  i18nReady: z.boolean().default(false),
});
```

**Naming Conventions:**
- `camelCase` for variables, functions, properties
- `PascalCase` for types, interfaces, classes, components
- `SCREAMING_SNAKE_CASE` for constants
- `kebab-case` for file names

```typescript
const MAX_RETRIES = 3;                           // Constant
function getLanguageFromURL(pathname: string) {} // Function
type DocsEntryType = DocsEntryData['type'];      // Type
```

**Arrow Functions:**
Use arrow functions for simple utilities, regular functions for exported APIs:

```typescript
// Utility - arrow function
export const stripLangFromSlug = (slug: string) => slug.split('/').slice(1).join('/');

// Public API - regular function with explicit return type
export function getLanguageFromURL(pathname: string): string {
  const langCodeMatch = pathname.match(/\/([a-z]{2}-?[a-z]{0,2})\//);
  return langCodeMatch ? langCodeMatch[1] : 'en';
}
```

### Astro Components

**Props:**
```astro
---
interface Props {
  title: string;
  variant?: 'primary' | 'secondary';
}

const { title, variant = 'primary' } = Astro.props;
---
```

### Error Handling

```typescript
// Prefer early returns
try {
  const data = await fetch(url);
  if (!data.ok) return null;
  return await data.json();
} catch (error) {
  console.error(`Failed to fetch: ${url}`, error);
  return null;
}
```

### File Organization

```
src/
  components/      # Reusable Astro components
  content/         # Content collections (docs, i18n)
  data/            # Static data files
  pages/           # Route pages
  util/            # Utility functions
config/            # Configuration & plugins
scripts/           # Build/utility scripts
```

## i18n Guidelines

- Only edit English source files in `src/content/docs/en/`
- UI strings go in `src/content/i18n/en.yml`
- Navigation labels go in `src/content/nav/en.ts`
- Other languages are handled by translators

## Content Schema Patterns

When extending content schemas, use discriminated unions:

```typescript
export const deploySchema = baseSchema.extend({
  type: z.literal('deploy'),
  logo: z.enum(logoKeys),
  supports: z.array(z.enum(['static', 'ssr'])),
});
```

## Git Workflow

- PRs to English pages trigger translation notifications
- Add "en-only" to PR title for English-only changes (typos, English wording)
- Generated pages (error-reference.md, configuration-reference.md) are maintained in other repos
