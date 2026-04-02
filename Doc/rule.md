# rule.md - Implementation Rules

## Project Rules

1. Use Next.js App Router with TypeScript.
2. Keep solution frontend-only and backend-independent.
3. Use mock/static data as source of truth.
4. Keep code modular and readable.
5. Prioritize clean UX over unnecessary complexity.

## UI Rules

1. Dashboard must include summary cards: Balance, Income, Expenses.
2. Must include one time-based visualization.
3. Must include one categorical visualization.
4. Transactions section must include search and filtering.
5. Layout must be responsive for mobile and desktop.
6. Empty and no-match states must be handled clearly.

## Role Simulation Rules

1. Role switch must be visible in the UI.
2. Viewer role is read-only.
3. Admin role can add/edit transactions.
4. Role behavior is simulated only on frontend state.

## State Rules

1. Track transactions, filters, and selected role in React state.
2. Use memoized derived values for summaries/insights/charts.
3. Persist transaction data in localStorage where possible.
4. Keep state transitions predictable and easy to trace.

## Quality Rules

1. Avoid dead code and duplicated logic.
2. Keep naming explicit and consistent.
3. Validate user input for add/edit form.
4. Verify lint passes before submission.
5. Document setup and feature mapping in README.
