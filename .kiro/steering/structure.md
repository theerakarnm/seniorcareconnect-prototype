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