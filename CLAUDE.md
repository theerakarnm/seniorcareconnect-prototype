# CLAUDE.md - Nursing Home Booking Platform

> AI Context File for Claude and other AI assistants working on this project
# Product Overview

## Senior Care Connect Prototype

This is a prototype application for senior care services, built as a full-stack TypeScript application with both web and mobile interfaces.

## Key Features
- Cross-platform support (Web via Next.js, Mobile via Expo)
- User authentication and authorization
- Database-driven content management
- Real-time data synchronization via tRPC
- Responsive UI components

## Target Platforms
- **Web**: Next.js application for desktop/web browsers
- **Mobile**: React Native/Expo application for iOS and Android
- **Shared**: Common business logic, API, and UI components across platforms
# Technology Stack

## Build System & Package Management
- **Monorepo**: Turborepo for build orchestration and caching
- **Package Manager**: pnpm with workspace support
- **Node.js**: Version 22.19.0+ required
- **TypeScript**: Strict TypeScript configuration across all packages

## Core Technologies
- **Frontend Web**: Next.js 15+ with React 19
- **Frontend Mobile**: Expo with React Native
- **Backend API**: tRPC for type-safe APIs
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query (React Query)

## Development Tools
- **Linting**: ESLint with custom configurations
- **Formatting**: Prettier with shared config
- **Type Checking**: TypeScript compiler
- **Environment**: dotenv for environment variables

## Common Commands

### Development
```bash
# Start all apps in development mode
pnpm dev

# Start only Next.js app
pnpm dev:next

# Start Expo app
pnpm android  # or pnpm ios
```

### Building & Testing
```bash
# Build all packages
pnpm build

# Type checking
pnpm typecheck

# Linting
pnpm lint
pnpm lint:fix

# Formatting
pnpm format
pnpm format:fix
```

### Database Operations
```bash
# Push database schema changes
pnpm db:push

# Open database studio
pnpm db:studio

# Generate auth schema
pnpm auth:generate
```

### Maintenance
```bash
# Clean all node_modules
pnpm clean

# Clean workspace build artifacts
pnpm clean:workspaces

# Check workspace dependencies
pnpm lint:ws
```

## Package Naming Convention
All internal packages use the `@acme/` namespace:
- `@acme/api` - tRPC API definitions
- `@acme/auth` - Authentication logic
- `@acme/db` - Database schema and client
- `@acme/ui` - Shared UI components
- `@acme/validators` - Zod validation schemas
- `@acme/nextjs` - Next.js web application
- `@acme/expo` - Expo mobile application

---
# Project Structure

## Monorepo Organization

This is a Turborepo monorepo with the following top-level structure:

```
├── apps/           # Application entry points
├── packages/       # Shared packages and libraries
├── tooling/        # Development tooling configurations
└── turbo/          # Turborepo generators and templates
```

## Applications (`apps/`)

### `apps/nextjs/`
- Next.js web application
- Uses App Router architecture
- API routes for tRPC and authentication
- Server and client components

### `apps/expo/`
- React Native mobile application via Expo
- File-based routing with Expo Router
- Platform-specific implementations when needed

## Shared Packages (`packages/`)

### `packages/api/`
- tRPC API definitions and routers
- Business logic and data fetching
- Type-safe API contracts

### `packages/auth/`
- Authentication configuration using Better Auth
- Auth providers and middleware
- Client and server auth utilities

### `packages/db/`
- Database schema definitions (Drizzle ORM)
- Database client configuration
- Migration and seeding utilities

### `packages/ui/`
- Shared React components
- Built on shadcn/ui and Radix UI
- Tailwind CSS styling
- Cross-platform component abstractions

### `packages/validators/`
- Zod validation schemas
- Shared type definitions
- Input/output validation logic

## Development Tooling (`tooling/`)

### `tooling/eslint/`
- ESLint configurations for different environments
- Base, Next.js, and React-specific rules

### `tooling/prettier/`
- Shared Prettier configuration
- Consistent code formatting across packages

### `tooling/tailwind/`
- Tailwind CSS configurations
- Base, web, and native-specific setups

### `tooling/typescript/`
- TypeScript configurations
- Base and compiled package configurations

### `tooling/github/`
- GitHub Actions and CI/CD setup

## File Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Configuration**: kebab-case (e.g., `eslint.config.js`)
- **Types**: PascalCase with `.types.ts` suffix when separate

## Import Patterns

- Use workspace references: `@acme/package-name`
- Relative imports within the same package
- Barrel exports from `index.ts` files
- Type-only imports when appropriate: `import type { ... }`

## Environment Configuration

- Root `.env` file for shared environment variables
- App-specific environment handling via `@t3-oss/env-nextjs`
- Environment variables prefixed by usage (e.g., `AUTH_`, `DB_`, `NEXT_PUBLIC_`)

## Build Outputs

- `dist/` - Compiled TypeScript packages
- `.next/` - Next.js build output
- `.expo/` - Expo build artifacts
- `.cache/` - Build tool caches (ESLint, Prettier, TypeScript)

---

## Context for AI Assistants

### Preferred Patterns

**1. Service Layer Pattern**
- Handler handle HTTP, validation, and serialization
- Domain contain business logic
- Repositories handle database access
- Keep handler thin, domain testable
- Each feature will contain to resources folders

**2. Transaction Management**
```typescript
// Always use transactions for multi-step operations
await db.$transaction(async (tx) => {
  const booking = await tx.booking.create({ data });
  await tx.priceCalendar.updateMany({
    where: { /* ... */ },
    data: { available: { decrement: 1 } },
  });
  await tx.payment.create({ data: { bookingId: booking.id } });
});
```
### Things to Avoid

❌ **Don't** expose internal IDs in URLs (use UUIDs or slugs)  
❌ **Don't** store payment card details (PCI-DSS violation)  
❌ **Don't** use `SELECT *` in production queries  
❌ **Don't** commit `.env` files or secrets to Git  
❌ **Don't** use `any` type in TypeScript (use `unknown` if truly dynamic)  
❌ **Don't** make DB queries in loops (use batch queries or joins)  

### When Suggesting New Features

**Always consider:**
1. **Data model impact:** Will this require schema changes?
2. **API contract:** Does this break existing clients?
3. **State machine:** How does this affect booking states?
4. **PDPA:** Does this collect/process personal data?
5. **Testing:** What test cases are needed?

**Provide:**
- Migration SQL (if schema change)
- API endpoint spec (method, path, request/response)
- Service method signature
- Test cases outline

---

## Questions or Clarifications?

If context is unclear, AI should:
1. State assumptions explicitly
2. Offer multiple approaches with pros/cons
3. Ask for clarification if business logic is ambiguous
4. Reference this file and project docs before external sources

**Last Updated:** 2025-01-08 
**Maintained By:** Theerakarnm Maiwong
