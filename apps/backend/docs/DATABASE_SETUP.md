# Database Setup Guide

This guide explains how to set up the PostgreSQL database for the Custom Gift.

## Prerequisites

- Docker and Docker Compose installed
- Node.js/Bun runtime
- Environment variables configured

## Database Schema

The system uses the following tables:

### Core Tables
- **users** - User authentication and profile information
- **clients** - Client contact and address information 
- **quotes** - Custom Gift records with versioning support
- **quote_items** - Individual line items within quotes

### Configuration Tables
- **templates** - HTML/CSS templates for document generation
- **company_settings** - Business information and branding
- **tax_rates** - Configurable tax rates
- **user_favorites** - User bookmarking system

## Setup Instructions

### 1. Start Database Services

```bash
npm run dev:services
```

This starts both PostgreSQL and Redis containers using Docker Compose.

### 2. Verify Services are Running

```bash
npm run dev:services:logs
```

Wait until you see PostgreSQL is ready to accept connections.

### 3. Run Database Setup

```bash
npm run db:setup
```

This script will:
- Test the database connection
- Run all migrations to create tables
- Verify the schema was created correctly

### 4. Seed Initial Data (Optional)

```bash
npm run db:seed
```

This creates:
- Default admin user (admin@example.com / admin123)
- Sample client record
- Default company settings
- Standard tax rates (GST, VAT, Sales Tax)
- Professional Custom Gift template

## Database Scripts

| Script | Description |
|--------|-------------|
| `npm run db:generate` | Generate new migration files from schema changes |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:push` | Push schema changes directly (dev only) |
| `npm run db:studio` | Open Drizzle Studio for database inspection |
| `npm run db:setup` | Complete database setup with verification |
| `npm run db:seed` | Populate database with initial data |

## Environment Configuration

Ensure your `.env` file contains:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5437/custom_gift_db
```

Note: The PostgreSQL container runs on port 5437 to avoid conflicts.

## Schema Relationships

```
users (1) ──→ (many) quotes
clients (1) ──→ (many) quotes  
quotes (1) ──→ (many) quote_items
quotes (1) ──→ (many) user_favorites
users (1) ──→ (many) user_favorites
quotes (self) ──→ (many) quotes (versioning)
```

## Troubleshooting

### Connection Refused Error
If you get `ECONNREFUSED`, ensure:
1. Docker services are running: `npm run dev:services`
2. PostgreSQL container is healthy: `docker ps`
3. Correct port (5437) in DATABASE_URL

### Migration Errors
If migrations fail:
1. Check database connection
2. Ensure no conflicting schema exists
3. Review migration files in `./drizzle/`

### Permission Issues
If you get permission errors:
1. Ensure PostgreSQL user has CREATE privileges
2. Check database exists: `custom_gift_db`
3. Verify connection string format

## Development Workflow

1. Make schema changes in `src/core/database/schema.ts`
2. Generate migration: `npm run db:generate`
3. Review generated SQL in `./drizzle/`
4. Apply migration: `npm run db:migrate`
5. Test changes with `npm run db:studio`

## Production Considerations

- Use environment-specific DATABASE_URL
- Enable SSL connections
- Set up database backups
- Configure connection pooling
- Monitor query performance
- Implement proper indexing strategy