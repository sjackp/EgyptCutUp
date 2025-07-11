# EGCU Racing Community Platform (EgyptCutUp)

## Overview

The EGCU (Egypt Cut Up) Racing Community Platform is a full-stack web application for a MENA-based Assetto Corsa racing community. It serves as a central hub for managing racing servers, sharing custom car modifications, community interaction, and shop items.

- **Frontend:** React 18 + TypeScript, Tailwind CSS, Shadcn/ui, Wouter
- **Backend:** Node.js (Express), TypeScript, PostgreSQL (Neon), Drizzle ORM
- **Authentication:** Replit Auth (OpenID Connect)
- **Monorepo:** Shared types and schema between client, server, and shared/

---

## Features
- Server management (CRUD)
- Car collection management
- Shop item management
- Discord stats integration
- Modern, responsive UI with racing/luxury theme
- Secure authentication and session management

---

## Project Structure
```
EgyptCutUp/
  client/   # React frontend
  server/   # Express backend
  shared/   # Shared TypeScript types/schema
  test-assetto-query.cjs  # Assetto Corsa UDP query test
```

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm
- PostgreSQL (Neon or local)

### Installation
1. **Clone the repo:**
   ```sh
git clone https://github.com/YOUR_USERNAME/EgyptCutUp.git
cd EgyptCutUp
   ```
2. **Install dependencies:**
   ```sh
npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your database, session, and auth details.

4. **Run database migrations:**
   ```sh
npm run db:push
   ```

5. **Start development servers:**
   ```sh
npm run dev
   ```
   - This starts both frontend and backend (see package.json for details).

---

## Scripts
- `npm run dev` – Start development servers
- `npm run build` – Build frontend and backend
- `npm run start` – Start production server
- `npm run db:push` – Run database migrations

---

## Assetto Corsa Server Query Test

A Node.js script to test UDP queries to an Assetto Corsa server is provided:

- **File:** `test-assetto-query.cjs`
- **Usage:**
  ```sh
  node test-assetto-query.cjs
  ```
- **What it does:**
  - Sends a UDP query to a specified Assetto Corsa server IP/port
  - Parses and prints the server's response (server name, track, session, player counts)
  - Useful for debugging server status and integration

---

## Architecture

### Frontend
- React 18, TypeScript, Tailwind CSS, Shadcn/ui, Wouter
- State: TanStack Query (React Query)
- Forms: React Hook Form + Zod

### Backend
- Node.js, Express, TypeScript (ESM)
- PostgreSQL (Neon), Drizzle ORM
- Auth: Replit Auth (OpenID Connect)
- Session: PostgreSQL store

### Shared
- TypeScript types and schema in `shared/`

---

## API Endpoints
- `/api/auth/*` – Authentication
- `/api/servers/*` – Server management
- `/api/cars/*` – Car collection
- `/api/shop/*` – Shop items
- `/api/discord/*` – Discord stats

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License
MIT 
