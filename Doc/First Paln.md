# First Plan - Finance Dashboard Assignment

## Goal
Build a clean, responsive, frontend-only finance dashboard in Next.js that demonstrates UI thinking, state handling, and role-based behavior.

## Scope

1. Dashboard overview with summary cards and two visualizations.
2. Transactions table with search, filters, and sorting.
3. Frontend-only role simulation (`viewer` and `admin`).
4. Insights panel with basic data observations.
5. Manage data and UI state in React with reliable derived values.
6. Handle responsive layout and empty states.

## Execution Steps

1. Scaffold app using Next.js and TypeScript.
2. Create mock transaction dataset.
3. Implement state for:
	- transactions
	- selected role
	- search/filter/sort controls
	- add/edit transaction form
4. Build dashboard sections:
	- header + role switch
	- summary cards
	- trend chart (time based)
	- category spending chart
	- transaction table
	- insights
	- admin form
5. Add localStorage persistence for transactions.
6. Add responsive styling and visual polish.
7. Add fallback UI for no-data cases.
8. Document features and setup in README.

## Definition of Done

1. All core assignment requirements are implemented.
2. Viewer role cannot mutate data.
3. Admin can add/edit/delete transactions.
4. Charts and insights update when data changes.
5. App runs cleanly with lint check.
