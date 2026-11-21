# Architecture

GK Atlas uses Next.js App Router server components for database-backed pages and Route Handlers for REST-style APIs.

```text
Browser
  -> Next.js pages / Route Handlers
  -> Prisma Client
  -> PostgreSQL
```

The UI is organized by route: models, comparison, rankings, AI labs, and providers. Shared layout and chart components remain in `src/components`.
