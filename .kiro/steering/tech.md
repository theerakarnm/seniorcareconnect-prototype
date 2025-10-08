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