# Neon PostgreSQL with Prisma

Prisma reads the existing `.env` file. `DATABASE_URL` is the pooled Neon URL used by the app at runtime; `DIRECT_URL` should use the same credentials with the `-pooler` part removed from the Neon hostname for schema changes. Keep both URLs private and never prefix them with `NEXT_PUBLIC_`.

The Prisma schema in `prisma/schema.prisma` is the database source of truth. Run `npm run db:push` to apply it to Neon. The application writes orders through `POST /api/orders`; it does not expose an endpoint for reading customer order records. Customer-side order history continues to work in browser storage if the database is unavailable.

The API uses Prisma and treats an existing order reference as an idempotent retry.
