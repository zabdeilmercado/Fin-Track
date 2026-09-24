# FinTrack

A personal expense, budget, and savings tracker in **Philippine pesos**, built with Vue 3, Vuetify, Pinia, and Supabase. It can be installed as a web app on supported phones and desktops.

## Start here

Follow **[SETUP.md](SETUP.md)** to connect an active Supabase project, install the database policies, configure email links, and publish the app. Cloud sign-in and syncing require that setup; the repository does not provision a remote project automatically.

```
npm ci
npm run dev
```

Copy `.env.example` to `.env` and supply your project's URL and public key before using real accounts. Keep existing local environment settings when updating the project. Node.js 22 is recommended.

## What it does

- Create and edit cash, checking, savings, and credit-card accounts.
- Record income, expenses, and transfers; edit/delete entries; search and filter transactions.
- Set an overall monthly budget and optional category limits. See remaining money, warnings at 80%, and the amount over budget.
- Link each savings goal to a separate savings account. Progress follows its actual balance.
- View monthly income, spending, money retained, and six-month comparisons.
- Sign in with email/password, recover a password, and sync data across devices.
- Export all records as JSON or transactions as CSV under Settings.
- Use mobile navigation, light/dark themes, and install from supported browsers.

## How money is counted

Account balances are opening balances plus transaction effects. Editing an account balance changes its current balance. Credit balances represent debt. Paying a credit card is a transfer, so an expense is not counted again at repayment.

Transfers preserve total net worth and do not count as income or spending. Monthly retained money is income minus expenses; savings-account balances show money actually set aside. Budgets apply to an explicit month. Category limits are sublimits, not extra money added to the overall budget. Goal balances are not added to net worth a second time.

Transactions must be completed entries dated today or earlier. Changing the display to PHP does not convert any amounts from older versions. Existing records should already represent peso amounts.

## Verification

```
npm run lint:check
npm test
npm run build
npm run audit:prod
npm run preview
```

The store tests use a mocked database boundary. They cover persistence, save failures, optimistic concurrency, transfers, credit repayment, goals, and budget math. They make no requests to your real Supabase project.

For an isolated browser test, set temporary `FINTRACK_FIXTURE_EMAIL` and
`FINTRACK_FIXTURE_PASSWORD` environment variables, run
`node scripts/browser-fixture.mjs`, and open `http://127.0.0.1:5175`.
The fixture stores temporary data in memory and is never imported into
production. It does not verify live Supabase authentication, email delivery,
row-level security, or server-side rate limiting.

## Hosting and data

Vercel configuration uses `dist` and SPA route rewrites. HTTPS is required for installation outside localhost. The production build generates a versioned service worker and caches only the app shell. Cloud financial data is not cached by the worker; an internet connection is required for sync. A new worker activates after older app tabs close, so updates do not interrupt an open form.

Each user owns one versioned `finance_state` document guarded by Supabase row-level security. Writes only appear locally after database success. Conflicting edits require a reload before retrying; records are not silently overwritten. Use Settings → Sync now to fetch changes from another device. New budget/goal collections are initialized for older documents.

This document model suits personal use. A substantially larger or multi-user shared accounting product should use normalized tables and database transactions.
