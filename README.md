# @kat-itb/database

Database package for KAT-ITB projects. Built with:

- **Drizzle ORM** — type-safe SQL for PostgreSQL
- **Postgres.js** — lightweight PostgreSQL client
- **tsup** — fast TypeScript bundler

## Setup

### Local Development (Docker)

```bash
docker run -d \
  --name kat-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=kat_itb \
  -p 5432:5432 \
  postgres:16-alpine

# Set DATABASE_URL in your .env
echo "DATABASE_URL=postgres://postgres:postgres@localhost:5432/kat_itb" > .env
```

### Production

1. Copy the connection string (starts with `postgres://`)
2. Set it as `DATABASE_URL` in your environment

### Apply Migrations

```bash
# Using drizzle-kit (recommended for development)
npm run migrate

# Or push schema directly
npm run push

# Or run the migrate script manually
npx tsx src/migrate.ts
```

## Usage

### In a TypeScript Backend (Hono, Express, etc.)

```bash
npm install @kat-itb/database
```

```ts
import * as schema from "@kat-itb/database";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

// Query example
const mentee = await db
  .select()
  .from(schema.users)
  .innerJoin(schema.accounts, eq(schema.users.id, schema.accounts.id))
  .where(
    and(
      eq(schema.users.id, userId),
      eq(schema.accounts.role, "user"),
    ),
  )
  .then((rows) => rows[0]);
```

### In a Go Backend

This package provides the schema reference. For Go, use the generated migration SQL directly.

```bash
# Generate the latest migration SQL (appears in drizzle/ directory)
npm run generate

# Copy migration files to your Go project or run them via goose/golang-migrate
```

Go typically connects directly to the same Postgres database using `pgx`:

```go
import (
  "github.com/jackc/pgx/v5"
  "github.com/jackc/pgx/v5/stdlib"
  "github.com/golang-migrate/migrate/v4"
  _ "github.com/golang-migrate/migrate/v4/database/postgres"
  _ "github.com/golang-migrate/migrate/v4/source/file"
)

conn, _ := pgx.Connect(ctx, os.Getenv("DATABASE_URL"))

// Run SQL migrations from drizzle/ folder
m, _ := migrate.New("file://drizzle", os.Getenv("DATABASE_URL"))
m.Up()
```

Your Go backend can also read `schema.dbml` directly — many Go tools support DBML for type/code generation.

## Scripts

| Command           | Description                |
| ----------------- | -------------------------- |
| `npm run build`   | Build the library          |
| `npm run generate`| Generate SQL migrations    |
| `npm run migrate` | Apply migrations           |
| `npm run push`    | Push schema to DB          |
| `npm run studio`  | Open Drizzle Studio        |
| `npx tsx src/dbml.ts` | Regenerate `schema.dbml` from Drizzle schema |

## Schema

The full schema is defined in `schema.dbml`. All Drizzle table definitions live in `src/schema/` organized by domain.
