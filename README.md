# Todo Pro (React + TypeScript + RTK Query)

A small SPA that demonstrates auth, protected routes, and Todos CRUD with filters, pagination, dark mode, Zod validation, and tests. **No real backend** — uses an in-app mock API (can be swapped for real backend easily).

## Tech

- React 18 + TypeScript
- Redux Toolkit (Slices + RTK Query)
- React Router v6
- React Hook Form + Zod
- Tailwind CSS (Dark mode)
- Tests: Vitest + React Testing Library
- Mock API: In-app `fakeBaseQuery` (latency + random failures), follows the contract
  - Endpoints: `/auth/login`, `/auth/register`, `/todos` (GET/POST), `/todos/:id` (PATCH/DELETE)
  - Authorization header uses a mock token `Bearer mock-<expEpochMs>`
- Custom reusable components: Input, Button, Select, Modal for consistent UI and forms


## Quick Start

```bash
# 1. Install
yarn install
# 2. Run
yarn dev
# 3. Open
http://localhost:5173
```

### Default Credentials

- Email: **test@gmail.com**
- Password: **123456**



## Notes

- Token persists via `localStorage`. Expiry is simulated for 1 hour. If you need shorter expiry to test redirects, change it in `mockApi.ts`.
- Random failures are thrown for create/update/delete to demonstrate optimistic updates, toasts, and error handling.
- Pagination is fixed at 10 per page.
- Filters: status, search, sort (createdAt, dueDate, priority). You can extend priority/tags filters easily.

## Tests

```bash
yarn test
```

## Swap to Real Backend

Replace `fakeBaseQuery` with `fetchBaseQuery` and point to your real server. Keep the endpoints the same, and remove in-app `mockApi`.
# todo-pro
