# Nursing Home Booking Platform

A comprehensive marketplace platform connecting elderly care seekers with nursing homes across the nation. Built with modern TypeScript stack for web and mobile platforms.

## 🎯 Project Overview

**Platform Name:** Nursing Home Booking Platform  
**Current Milestone:** M1 - Booking System (Core Feature)  
**Timeline:** 2-3 weeks for initial demo  
**Architecture:** Cross-platform (Web + Mobile) with shared business logic

## 🚀 Core Value Proposition

### For Customers
- **Search & Discovery**: Find nursing homes by location, amenities, and pricing
- **Compare Options**: Side-by-side comparison of facilities and services
- **Secure Booking**: End-to-end booking with payment protection
- **Reviews & Ratings**: Community-driven quality insights

### For Suppliers (Nursing Homes)
- **Property Management**: Comprehensive facility and room management
- **Dynamic Pricing**: Flexible pricing strategies and availability control
- **Booking Dashboard**: Real-time booking management and analytics
- **Quality Assurance**: Platform-supported quality control processes

### For Platform
- **Payment Processing**: Secure intermediary payment handling
- **Quality Control**: Supplier verification and ongoing monitoring
- **Analytics & Insights**: Business intelligence and performance metrics
- **Compliance Management**: PDPA and regulatory compliance tools

## 🏗️ Technology Stack

- **Frontend Web**: Next.js 15 with React 19
- **Frontend Mobile**: Expo with React Native
- **Backend API**: tRPC for type-safe APIs
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **Styling**: Tailwind CSS with shadcn/ui
- **State Management**: TanStack Query
- **Build System**: Turborepo with pnpm workspaces

## 📋 Key Business Rules

### Payment Flow
- Platform acts as payment intermediary
- Customers pay the platform, not suppliers directly
- Secure escrow system protects both parties
- Automated payout to suppliers after service completion

### Quality Control
- All suppliers require QC approval before going live
- Ongoing quality monitoring and compliance checks
- Customer feedback integration for continuous improvement
- Suspension/removal protocols for non-compliant suppliers

### Booking Management
- Strict booking state machine implementation
- See `/docs/booking-states.md` for detailed flow
- Real-time availability synchronization
- Automated confirmation and notification system

### Data Protection
- Full PDPA compliance for all data collection
- Secure handling of sensitive customer information
- Transparent privacy policies and consent management
- Regular security audits and compliance reviews

## 🚀 Quick Start

### Prerequisites
- Node.js 22.19.0+
- pnpm 10.15.1+
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd nursing-home-booking-platform

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
pnpm db:push

# Generate authentication schema
pnpm auth:generate
```

### Development

```bash
# Start all applications
pnpm dev

# Start web app only
pnpm dev:next

# Start mobile app
pnpm android  # or pnpm ios
```

### Building

```bash
# Build all packages
pnpm build

# Type checking
pnpm typecheck

# Linting and formatting
pnpm lint
pnpm format
```

## 📁 Project Structure

```
├── apps/
│   ├── nextjs/          # Web application
│   └── expo/            # Mobile application
├── packages/
│   ├── api/             # tRPC API definitions
│   ├── auth/            # Authentication logic
│   ├── db/              # Database schema & client
│   ├── ui/              # Shared UI components
│   └── validators/      # Zod validation schemas
├── tooling/             # Development configurations
└── docs/                # Documentation
```

## 🎯 Milestone 1 Features

### Customer Features
- [ ] Nursing home search and filtering
- [ ] Facility detail pages with photos and amenities
- [ ] Room availability and pricing display
- [ ] Booking flow with payment integration
- [ ] User registration and profile management

### Supplier Features
- [ ] Supplier onboarding and verification
- [ ] Property and room management dashboard
- [ ] Availability calendar management
- [ ] Booking management interface
- [ ] Basic analytics and reporting

### Platform Features
- [ ] Admin dashboard for quality control
- [ ] Payment processing and escrow system
- [ ] Booking state management
- [ ] Basic notification system
- [ ] PDPA compliance framework

## 🔐 Environment Variables

Key environment variables required:

```bash
# Database
POSTGRES_URL=

# Authentication
AUTH_SECRET=
AUTH_DISCORD_ID=
AUTH_DISCORD_SECRET=

# Platform
NEXT_PUBLIC_APP_URL=
```

## 📚 Documentation

- [Booking States](/docs/booking-states.md) - Detailed booking flow documentation
- [API Documentation](/docs/api.md) - tRPC API reference
- [Deployment Guide](/docs/deployment.md) - Production deployment instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 🆘 Support

For technical support or questions, please contact the development team or create an issue in the project repository.