# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Platform Name:** Nursing Home Booking Platform
**Current Milestone:** M1 - Booking System (Core Feature)
**Timeline:** 2-3 weeks for initial demo
**Architecture:** Cross-platform (Web + Mobile) with shared business logic

This is a comprehensive marketplace platform connecting elderly care seekers with nursing homes across the nation. The platform acts as a payment intermediary, similar to Agoda/Grab model.

## Technology Stack

### Backend
- **Runtime:** Bun 1.2+
- **Framework:** Hono.js
- **Language:** TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Better Auth
- **Cache:** Redis (optional)

### Frontend Web (Internal/Admin)
- **Framework:** React Router v7
- **Styling:** Tailwind CSS with shadcn/ui
- **Language:** TypeScript

### Frontend Mobile (Customer)
- **Framework:** Lynx (React-based)
- **Build Tool:** Rsbuild with Rspeedy
- **Language:** TypeScript

## Development Commands

### Backend Development
```bash
cd apps/backend

# Start development server with hot reload
bun run dev

# Database operations
bun run db:generate  # Generate Drizzle migrations
bun run db:migrate   # Run database migrations
bun run db:push      # Push schema changes to database
bun run db:studio    # Open Drizzle Studio

# Development services (Redis, PostgreSQL)
bun run dev:services        # Start docker services
bun run dev:services:stop   # Stop docker services
bun run dev:services:logs   # View service logs
```

### Web Internal Development
```bash
cd apps/web-internal

# Start development server
bun run dev

# Build for production
bun run build

# Type checking
bun run typecheck

# Database operations (uses different Drizzle version)
bun run db:generate
bun run db:migrate
```

### Mobile App Development
```bash
cd apps/client-mobile-app

# Start development server
bun run dev

# Build for production
bun run build

# Run tests
bun run test
```

## Project Structure

```
apps/
├── backend/                    # Hono.js API server
│   ├── src/
│   │   ├── core/              # Core business logic
│   │   │   ├── auth/          # Authentication system
│   │   │   ├── config/        # Configuration management
│   │   │   ├── database/      # Database schema and connection
│   │   │   └── services/      # Business services
│   │   ├── routes/            # API route handlers
│   │   ├── resources/         # Resource-based endpoints
│   │   └── libs/              # Shared utilities
│   └── drizzle.config.ts      # Drizzle configuration
├── web-internal/              # React Router web app
│   ├── app/                   # App routes and components
│   └── components.json        # shadcn/ui configuration
└── client-mobile-app/         # Lynx mobile app
    └── rsbuild.config.ts      # Build configuration
```

## Environment Setup

1. Copy `.env.example` to `.env` and configure:
   ```bash
   # Database
   POSTGRES_URL="postgres://username:password@host:port/database"

   # Authentication
   AUTH_SECRET="your-secret-key"
   AUTH_DISCORD_ID=""
   AUTH_DISCORD_SECRET=""

   # Node environment
   NODE_ENV="development"
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up database:
   ```bash
   cd apps/backend
   bun run db:push
   ```

## Database and ORM

- **Schema location:** `apps/backend/src/core/database/schema.ts`
- **Migrations:** Generated in `apps/backend/drizzle/`
- **ORM:** Drizzle with PostgreSQL dialect
- **Always use transactions** for multi-step operations

## Key Architecture Patterns

### Service Layer Pattern
- Handlers manage HTTP, validation, and serialization
- Domain services contain business logic
- Repositories handle database access
- Keep handlers thin, domains testable

### Authentication Flow
- Uses Better Auth for authentication
- Discord OAuth provider preconfigured
- JWT-based session management
- Role-based access control

### Error Handling
- Custom error classes with specific error codes
- Centralized error handling middleware
- Standardized error response format

## Development Notes

- The backend runs on port 3001 by default
- Redis is optional (can be disabled with REDIS_ENABLED=false)
- All new code should prefer TypeScript over JavaScript
- Use UUID v4 for primary keys
- Follow the existing naming conventions (camelCase for variables, PascalCase for components)
- Database tables use snake_case naming

## Testing

- Backend tests are located in `apps/backend/src/__test__/`
- Mobile app uses Vitest for testing
- Always write tests for new business logic

## Current Status

Based on git status, the project has undergone recent restructuring with:
- New authentication system implementation
- Core configuration updates
- Database schema changes
- New service layer architecture

The platform is in active development for Milestone 1 focusing on the core booking system functionality.