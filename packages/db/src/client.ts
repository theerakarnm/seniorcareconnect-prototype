import { Pool } from 'pg';
import type { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from "./schema";
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgTransaction } from 'drizzle-orm/pg-core';

// Use the same non-pooling URL as drizzle config
const nonPoolingUrl = process.env.POSTGRES_URL?.replace(":6543", ":5432") || "";

export const db = drizzle({
  client: new Pool({
    connectionString: nonPoolingUrl,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  }),
  schema,
  logger: true,
  casing: "snake_case",
});

export type PgTx = PgTransaction<NodePgQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>