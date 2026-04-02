# Code Flow (Easy Method)

This document explains how the app works from start to finish in simple steps.

## 1. App Entry Flow

1. Next.js loads the app through src/app/layout.tsx.
2. Home route loads src/app/page.tsx.
3. page.tsx renders DashboardClient.

So, DashboardClient is the main controller of the whole dashboard.

## 2. Main Controller: DashboardClient

File: src/components/dashboard/DashboardClient.tsx

DashboardClient manages:
- Authentication state
- Transactions state
- Search/filter/sort state
- Form state for add/edit
- Derived dashboard data (summary, charts, insights)

It is the central data layer for all child components.

## 3. Initial Load and Hydration

When DashboardClient mounts:

1. It reads auth data from localStorage using AUTH_STORAGE_KEY.
2. If auth JSON is valid, user is logged in.
3. If auth JSON is invalid, it removes that key.
4. It reads transactions from localStorage using STORAGE_KEY.
5. If transactions JSON is valid, it uses that list.
6. If invalid, it silently keeps seedTransactions.
7. Then it sets hydrated = true.

Before hydrated = true, it shows a loading state.

## 4. Login Flow

Component: src/components/dashboard/LoginPanel.tsx

1. User enters email and password.
2. App matches credentials against src/data/mockUsers.ts.
3. If no match: shows error message.
4. If match: builds AuthUser object (without password).
5. Calls onLogin from DashboardClient.
6. DashboardClient saves auth in localStorage.

Now dashboard UI appears.

## 5. Role Flow (Viewer/Admin)

Role is derived from authUser.role.

- Viewer:
  - Cannot add, edit, delete
  - Sees read-only indicators
- Admin:
  - Full transaction mutation access

Visible role switch:
- In DashboardHeader there is a role select input.
- Changing role triggers handleRoleChange in DashboardClient.
- State and localStorage are updated.
- Form and edit state are reset for safe transition.

## 6. Data Pipeline for Dashboard Metrics

Raw source: transactions state array.

Derived values are memoized with useMemo:

1. getSummary(transactions)
- income = sum of all income amounts
- expenses = sum of all expense amounts
- balance = income - expenses

2. getTrendData(transactions)
- Groups by month (YYYY-MM)
- Income positive, expense negative
- Returns month-wise net values for line chart

3. getSpendingByCategory(transactions)
- Uses only expense rows
- Aggregates by category
- Sorts descending by amount

4. getInsights(transactions)
- Finds top expense category
- Compares latest month expense vs previous month
- Generates observation text from balance/savings rate

These values feed:
- SummaryCards
- ChartsSection
- InsightsSection

## 7. Search, Filter, and Sort Flow

State variables:
- search
- typeFilter
- categoryFilter
- sortBy

filteredTransactions is computed with this order:

1. Text match against category, note, or date
2. Type filter (all/income/expense)
3. Category filter (all/specific)
4. Sorting by selected sort mode

This result is passed to TransactionsSection table.

If no rows match, a clear empty state is shown.

## 8. Transaction CRUD Flow

### Add

1. Admin fills form in TransactionFormSection.
2. onSubmit validates:
- date must exist
- category must be non-empty after trim
- amount must be numeric and > 0
3. New transaction object is created.
4. persist(next) updates state + localStorage.
5. Form is cleared.

### Edit

1. Admin clicks Edit from TransactionsSection.
2. startEdit loads selected row into form.
3. Submit updates matching transaction by id.
4. persist(next) saves update.
5. Form clears and editingId resets.

### Delete

1. Admin clicks Delete.
2. removeTransaction filters row by id.
3. persist(next) saves new list.
4. If deleted row was being edited, form is cleared.

Viewer attempts are blocked early by role guard checks.

## 9. Component Responsibility Map

- DashboardClient: state + handlers + derived data
- DashboardHeader: user info, logout, role switch
- DashboardSidebar: left navigation and balance snapshot
- SummaryCards: balance/income/expenses cards
- ChartsSection: trend and category charts
- AllTransactionsPanel: full card list (unfiltered)
- TransactionsSection: searchable/filterable/sortable table
- TransactionFormSection: admin add/edit form
- InsightsSection: calculated text insights
- LoginPanel: auth entry UI

## 10. localStorage Keys

From data files:

- AUTH_STORAGE_KEY = finance-dashboard-auth-v1
- STORAGE_KEY = finance-dashboard-transactions-v2

Behavior:
- Auth saved on login/role switch
- Auth removed on logout
- Transactions saved on add/edit/delete
- Invalid JSON falls back safely

## 11. Test Flow Coverage

The test suite validates:

1. Utility calculations in src/lib/finance-utils.test.ts
2. Login behavior in src/components/dashboard/LoginPanel.test.tsx
3. Header role switching in src/components/dashboard/DashboardHeader.test.tsx
4. Table action and view-only states in src/components/dashboard/TransactionsSection.test.tsx
5. End-to-end dashboard flows in src/components/dashboard/DashboardClient.test.tsx:
- login
- role switch
- add and persist
- hydrate from storage
- malformed storage fallback
- filter no-match
- sorting
- logout

## 12. Error Note

If you see errors from URLs starting with chrome-extension://..., that error is from a browser extension script, not from this app source code.

## 13. Simple Mental Model

Think of app flow like this:

1. Load data from localStorage (or fallback seed)
2. User logs in
3. Role decides what actions are allowed
4. Transactions array is the single source of truth
5. Everything else (cards, charts, insights, table rows) is derived from transactions + filters
6. Any mutation writes back to localStorage
