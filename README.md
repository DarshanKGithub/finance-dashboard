# Finance Dashboard (Next.js)

This is a frontend-only finance dashboard project built with Next.js App Router and TypeScript.

The app simulates two roles:
- Admin: can add, edit, and delete transactions.
- Viewer: read-only mode.

No backend is used. All data is mock data plus browser localStorage.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Scripts

- npm run dev: Start development server
- npm run build: Build production app
- npm run start: Run production build
- npm run lint: Run ESLint
- npm run test: Run Vitest in watch mode
- npm run test:run: Run tests once

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- Material UI (table, icons, charts)
- Vitest + React Testing Library

## Main Features

1. Authentication Simulation
- Login with demo credentials from mock users.
- Auth state is saved in localStorage.

2. Visible Role Switch
- Role switch is available in dashboard header.
- Switch between Viewer and Admin instantly.

3. Dashboard Overview
- Summary cards: Balance, Income, Expenses.
- Time-based chart: monthly balance trend.
- Category chart: expense breakdown by category.

4. Transactions Management
- Search by category, note, or date.
- Filter by type and category.
- Sort by latest, oldest, high amount, low amount.
- Admin can add/edit/delete transactions.
- Viewer cannot mutate data.

5. Insights
- Top spending category.
- Latest month vs previous month expense comparison.
- Cash-flow observation text.

6. Persistence and Fallback
- Transactions are saved to localStorage.
- If saved data is invalid, app falls back to seed data safely.

## Project Structure

- src/app: app entry files
- src/components/dashboard: main dashboard sections
- src/components/ui: reusable UI components
- src/data: mock users and transactions
- src/lib: calculation and helper utilities
- src/types: shared TypeScript types
- Doc: assignment and flow documentation

## Demo Credentials

- Admin
	- Email: admin@finflow.com
	- Password: admin123
- Viewer
	- Email: viewer@finflow.com
	- Password: viewer123

## Testing

Current test coverage includes:
- Utility functions (summary, trend, category totals, insights)
- Login flow and credential validation
- Role switch behavior
- Viewer read-only restrictions
- Admin add transaction flow and persistence
- Filter no-match state
- Sorting behavior
- localStorage hydration and malformed storage fallback

Run tests:

```bash
npm run test:run
```

## Documentation

- Assignment plan: [Doc/First Paln.md](Doc/First%20Paln.md)
- Assignment rules: [Doc/rule.md](Doc/rule.md)
- Full app flow (easy explanation): [Doc/CodeFlow.md](Doc/CodeFlow.md)

## Notes

- This project is fully frontend-only.
- To reset state, clear localStorage keys used by the app.
