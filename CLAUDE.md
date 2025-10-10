# CLAUDE.md - Nursing Home Booking Platform

> AI Context File for Claude and other AI assistants working on this project

## Project Overview

**Platform Name:** Nursing Home Booking Platform  
**Milestone:** M1 - Booking System (Core Feature)  
**Timeline:** 2-3 weeks for initial demo  
**Purpose:** Connect elderly care seekers with nursing homes through a booking marketplace, similar to Agoda/Grab model

### Core Value Proposition
- **For Customers:** Search, compare, and book nursing home rooms nationwide
- **For Suppliers:** Manage properties, rooms, pricing, and bookings
- **For Platform:** Quality control, payment processing, and analytics

### Key Business Rules
- Platform acts as payment intermediary (customers pay platform, not suppliers directly)
- Quality control (QC) approval required for all suppliers before going live
- Booking states follow strict state machine (see `/docs/booking-states.md`)
- PDPA compliance is mandatory for all data collection

---

## Technical Stack

### Backend
- **Runtime:** Bun.sh (v1.2)
- **Framework:** Hono.js
- **Language:** TypeScript preferred for new code
- **ORM:** Drizzle ORM
- **API Style:** RESTful + BFF pattern

### Frontend
- **Mobile:** Lynx (iOS + Android)
- **Web (Supplier/Admin):** React Router v7
- **State Management:** React Router State (primary method https://reactrouter.com/explanation/state-management) / Zustand (secondary method)
- **UI Library:** React Native Paper / shadcn/ui (web)

### Database
- **Primary:** PostgreSQL 16+
- **Cache:** Redis 7+
- **Search:** PostgreSQL Full-Text Search (Elasticsearch if needed later)

---

## Development Guidelines

### Code Style
- **Formatting:** Prettier with 80-char line width (`.prettierrc` in root)
- **Linting:** ESLint with strict TypeScript rules
- **Naming:**
  - Files: `kebab-case.ts`, `PascalCase.tsx` (components)
  - Variables/functions: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Database tables: `snake_case`

### TypeScript Conventions
```typescript
// ✅ Good: Explicit types, avoid `any`
interface BookingCreateInput {
  userId: string;
  roomTypeId: string;
  checkIn: Date;
  checkOut: Date;
}

async function createBooking(
  input: BookingCreateInput
): Promise<Booking> {
  // implementation
}

// ❌ Bad: Implicit any, unclear types
function createBooking(data) {
  // ...
}
```

### API Response Format

```typescript
// Success response
{
  "success": true,
  "data": { /* ... */ },
  "meta": {
    "timestamp": "2025-01-05T10:30:00Z",
    "requestId": "uuid"
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "BOOKING_UNAVAILABLE",
    "message": "Room is not available for selected dates",
    "details": { /* ... */ }
  },
  "meta": { /* ... */ }
}
```

### Database Conventions
- **IDs:** Use UUID v4 (`id UUID PRIMARY KEY DEFAULT gen_random_uuid()`)
- **Timestamps:** Always include `created_at` and `updated_at` (with triggers)
- **Soft Deletes:** Use `deleted_at TIMESTAMP NULL` where applicable
- **Indexes:** Add for all FK, frequently queried fields, and date ranges
- **Migrations:** Never edit existing migrations; create new ones

### Git Workflow
- **Branch naming:** `feature/booking-payment`, `fix/email-template`, `docs/api-spec`
- **Commits:** Conventional Commits format (`feat:`, `fix:`, `docs:`, `refactor:`)
- **PRs:** Must pass CI, require 1 approval, include tests for new features

---

## Context for AI Assistants

### Preferred Patterns

**1. Service Layer Pattern**
- Handler handle HTTP, validation, and serialization
- Domain contain business logic
- Repositories handle database access
- Keep handler thin, domain testable
- Each feature will contain to resources folders

**2. Error Handling**
```typescript
// Use custom error classes
export class BookingNotFoundError extends Error {
  code = 'BOOKING_NOT_FOUND';
  statusCode = 404;
}

// Central error handler middleware
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message,
    },
  });
});
```

**3. Transaction Management**
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

### Helpful Aliases

When generating code, assume these common imports:

```typescript
// Database
import { db } from '@/lib/database';
import type { Booking, User, Payment } from '@prisma/client';

// Utilities
import { logger } from '@/lib/logger';
import { config } from '@/lib/config';

// Validation
import { z } from 'zod';

// Testing
import { describe, it, expect, beforeEach } from 'vitest';
```

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

## External Documentation

- [Drizzle Docs](https://orm.drizzle.team/docs/overview) - ORM reference
- [React Router](https://reactrouter.com/home) - Web framework
- [Lynx Docs](https://lynxjs.org/guide/start/quick-start.html)
- [PDPA Thailand Overview](https://www.pdpc.gov.sg/overview-of-pdpa) - Privacy law

---

## Questions or Clarifications?

If context is unclear, AI should:
1. State assumptions explicitly
2. Offer multiple approaches with pros/cons
3. Ask for clarification if business logic is ambiguous
4. Reference this file and project docs before external sources

**Last Updated:** 2025-01-05  
**Maintained By:** Theerakarnm (Engineer)
