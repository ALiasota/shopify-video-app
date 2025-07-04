import type { ConnectionOptions } from "tls";

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../../drizzle/schema.server";
import { logger } from "app/service/logger.server";

const { Pool } = pg;

const getDbSslOptions = (): ConnectionOptions | undefined => {

  return {
    rejectUnauthorized: true,
  };
};

const pool = new Pool({
  connectionString: `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  // ssl: getDbSslOptions(),
  min: 2,
  max: 10,
});

// Verify connection configuration works
(async () => {
  (await pool.connect()).release();
})();

export const db = drizzle(pool, { schema });

// type safety at the price of safe transactions, see comment below for details
export type DbTransactionClient = Omit<typeof db, "$client">;

/**
 * WARNING. Be careful about DB locks with this one, since we're managing it ourselves, we COULD
 * get into a case where you BEGIN the max amount of transactions before you COMMIT them, and if they
 * deadlock each other on the DB level, you're out of luck.
 *
 * Parallel safe transaction running.
 * The reality is that drizzle's transactions are NOT atomic, as a single connection can be shared by default by many transactions.
 * A pool doesn't save you from this, as the moment there are no free connections, drizzle will still try to use one of the existing ones.
 *
 * Meaning one transaction's failure could result in every other transaction failing in a parallel execution such as:
 *
 * ```typescript
 * await db.transaction(async (txn) => {
 *   await Promise.all([query1, query2]);
 * });
 * ```
 *
 * In the example above, if `query1` fails, `query2` will fail with an error similar to this:
 *
 * >error: current transaction is aborted, commands ignored until end of transaction block
 *
 * meaning, since the connection was reused for `query2` as well, it failed due to an unrelated exception that was caused by `query1`
 * terminating transaction in the connection.
 *
 * For more information, you can take a look at this. Drizzle hasn't shown any intention on changing this judging from the thread.
 *
 * https://github.com/drizzle-team/drizzle-orm/issues/1743
 */
export async function runTransaction(
  callback: (drizzleClient: DbTransactionClient) => Promise<void>,
) {
  const client = await pool.connect();

  try {
    const drizzleClient = drizzle(client, { schema });
    await client.query("BEGIN");
    await callback(drizzleClient);
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error("Error during transaction", err);
    throw err;
  } finally {
    client.release();
  }
}
