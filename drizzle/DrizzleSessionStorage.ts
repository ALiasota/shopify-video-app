import { Session } from "@shopify/shopify-app-remix/server";
import type { SessionStorage } from "@shopify/shopify-app-session-storage";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { desc, eq, inArray } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";

import type { ShopifySessionTable } from "./schema.server";

export class DrizzleSessionStoragePostgres implements SessionStorage {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly db: PgDatabase<PgQueryResultHKT, any>,
    private readonly sessionTable: ShopifySessionTable,
  ) {}

  public async storeSession(session: Session): Promise<boolean> {
    const row = this.sessionToRow(session);

    await this.db
      .insert(this.sessionTable)
      .values({ ...row })
      .onConflictDoUpdate({
        target: this.sessionTable.id,
        set: { ...row },
      });

    return true;
  }

  public async loadSession(id: string): Promise<Session | undefined> {
    try {
      const row = await this.db
        .select()
        .from(this.sessionTable)
        .where(eq(this.sessionTable.id, id));

      if (!row[0]) {
        return undefined;
      }

      return this.rowToSession(row[0]);
    } catch (error) {
      console.error(error);

      return undefined;
    }
  }

  public async deleteSession(id: string): Promise<boolean> {
    try {
      await this.db
        .delete(this.sessionTable)
        .where(eq(this.sessionTable.id, id));
    } catch (error) {
      console.error(error);

      return false;
    }

    return true;
  }

  public async deleteSessions(ids: string[]): Promise<boolean> {
    try {
      await this.db
        .delete(this.sessionTable)
        .where(inArray(this.sessionTable.id, ids));

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  public async findSessionsByShop(shop: string): Promise<Session[]> {
    const sessions = await this.db
      .select()
      .from(this.sessionTable)
      .where(eq(this.sessionTable.shop, shop))
      .orderBy(desc(this.sessionTable.expires));

    return sessions.map((session) => this.rowToSession(session));
  }

  private sessionToRow(
    session: Session,
  ): InferInsertModel<ShopifySessionTable> {
    return {
      id: session.id,
      shop: session.shop,
      state: session.state,
      isOnline: session.isOnline,
      expires: session.expires,
      accessToken: session.accessToken as string,
    };
  }

  private rowToSession(row: InferSelectModel<ShopifySessionTable>): Session {
    const sessionParams: Record<string, boolean | string | number> = {
      id: row.id,
      shop: row.shop,
      state: row.state,
      isOnline: row.isOnline,
    };

    if (row.expires) {
      sessionParams.expires = row.expires as any;
    }

    if (row.accessToken) {
      sessionParams.accessToken = row.accessToken;
    }

    return Session.fromPropertyArray(Object.entries(sessionParams));
  }
}
