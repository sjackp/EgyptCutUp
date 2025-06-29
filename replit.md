# EGCU Racing Community Platform

## Overview

The EGCU (Egypt Cut Up) Racing Community Platform is a full-stack web application designed for a MENA-based Assetto Corsa racing community with 11,000+ members. The platform serves as a central hub for managing racing servers, sharing custom car modifications, community interaction, and managing shop items.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with a custom dark racing theme
- **Component Library**: Shadcn/ui components built on Radix UI primitives
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with TypeScript support

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express session with PostgreSQL store

### Monorepo Structure
The application follows a monorepo pattern with shared TypeScript definitions:
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared schema definitions and types

## Key Components

### Database Schema
- **Sessions Table**: Required for Replit Auth, stores user sessions
- **Users Table**: User profiles with Replit Auth integration
- **Servers Table**: Racing server information (name, region, status, player counts)
- **Cars Table**: Custom car modifications with download links and categories
- **Shop Items Table**: Merchandise and digital content
- **Discord Stats Table**: Community statistics integration

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions with 7-day TTL
- **Authorization**: Route-level authentication middleware
- **User Management**: Automatic user creation/updates from Replit profile

### API Structure
RESTful API endpoints:
- `/api/auth/*` - Authentication routes
- `/api/servers/*` - Server management (CRUD operations)
- `/api/cars/*` - Car collection management
- `/api/shop/*` - Shop item management
- `/api/discord/*` - Discord integration stats

### UI Components
- **Racing Theme**: Custom dark theme with red and gold accents
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Component System**: Reusable components following atomic design principles
- **Form Handling**: Validated forms with error handling and loading states

## Data Flow

### Client-Server Communication
1. Frontend makes API requests using TanStack Query
2. Express middleware handles authentication and request logging
3. Route handlers interact with Drizzle ORM for database operations
4. Responses are cached on the client for optimal performance

### Authentication Flow
1. User clicks login → redirects to Replit Auth
2. Successful auth creates/updates user in database
3. Session stored in PostgreSQL with secure cookie
4. Protected routes check authentication status

### Content Management
1. Admin users can create/edit servers, cars, and shop items
2. Forms validate data using Zod schemas
3. Database operations through Drizzle ORM
4. Real-time updates via query invalidation

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL serverless
- **Authentication**: Replit Auth service
- **CDN**: Unsplash for placeholder images
- **Icons**: Lucide React icons, React Icons

### Development Tools
- **TypeScript**: Strict type checking across the stack
- **ESLint/Prettier**: Code formatting and linting
- **Vite**: Fast development server with HMR
- **PostCSS**: CSS processing with Tailwind

### Third-party Services
- **Discord Integration**: Stats and community features
- **File Storage**: External URLs for car downloads and images

## Deployment Strategy

### Development Environment
- **Local Development**: `npm run dev` starts both frontend and backend
- **Hot Reload**: Vite HMR for frontend, tsx for backend
- **Database**: Migrations via `npm run db:push`

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: ESBuild bundles server code
- **Database**: Automated migrations on deploy
- **Environment**: Node.js production server

### Configuration
- **Environment Variables**: Database URL, session secrets, Replit Auth config
- **Build Process**: Separate frontend and backend builds
- **Static Assets**: Served from Express in production

## Changelog
- June 29, 2025. Initial setup with full-stack architecture
- June 29, 2025. Complete premium automotive design transformation
- June 29, 2025. Populated with comprehensive mock data (8 servers, 20 cars, 12 shop items)

## Recent Changes
- **Design Overhaul**: Transformed from racing theme to luxury automotive aesthetic inspired by BMW, Mercedes, Audi
- **Premium Components**: Implemented glass-card effects, sophisticated gradients, elegant typography
- **Mock Data Population**: Added realistic servers across MENA region, premium car modifications, and exclusive shop items
- **Enhanced UX**: Smooth animations, hover effects, professional button styling with rounded corners

## User Preferences

Preferred communication style: Simple, everyday language.