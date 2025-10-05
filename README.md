# Zeller Code Challenge (React + TypeScript + Vite)

This app displays Zeller customers grouped by user type (Admin/Manager)

### Tech Stack

- React 19 + TypeScript
- Vite 7
- Ant Design 5
- Vitest + React Testing Library
- ESLint (flat) + Prettier

## Getting Started

### Prerequisites

- Node.js v22.x (recommended via nvm: `nvm use 22` or `nvm install 22`)

1. Install dependencies

```bash
npm install
```

2. Configure environment

- Copy `.env.example` to `.env` and fill values (see below for details).

3. Run dev server

```bash
npm run dev
```

## Environment Variables

The app reads AppSync configuration via Vite env vars in `src/aws-exports.ts`.

Create `.env` from `.env.example`:

- `VITE_AWS_APPSYNC_GRAPHQL_ENDPOINT`: AppSync GraphQL endpoint URL
- `VITE_AWS_APPSYNC_REGION`: AWS region (e.g. `ap-southeast-2`)
- `VITE_AWS_APPSYNC_API_KEY`: API key for AppSync

## Project Structure

```
src/
  components/
    UserAdminPanel.tsx    // UI and view-state only
  services/
    customers.ts          // Data access
  lib/
    graphqlClient.ts      // Fetch wrapper with timeout/retry/abort
  graphql/queries.ts      // Documented queries
  setupTests.ts           // RTL/JSDOM setup
```

## Testing

- Unit tests for `graphqlClient` (success, HTTP error, timeout)
- Unit tests for `customers` service (mapping/normalization, filtering)
- Component tests for `UserAdminPanel` (loading -> data, error alert)

Run:

```bash
npm run test
```

## Performance & UX

- `useMemo` to avoid recomputing derived lists
- Configurable timeout and retries in GraphQL client
- AntD `Skeleton` for loading and `Empty` for no-data state
- Basic responsiveness via AntD layout; accessible error `Alert`

## Security & Config

- Secrets moved to `.env` (not committed)
- Strict TypeScript; ESLint + Prettier
- Errors surface to UI without coupling data layer to UI library
