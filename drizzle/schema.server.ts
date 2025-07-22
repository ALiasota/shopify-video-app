import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const merchantTable = pgTable("merchant", {
    id: serial("id").primaryKey(),
    shop: text("shop").notNull().unique(),
    shopId: text("shop_id").notNull(),
    email: text("email").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export const sessionTable = pgTable("session", {
    id: text("id").primaryKey(),
    shop: text("shop").notNull(),
    state: text("state").notNull(),
    isOnline: boolean("isOnline").default(false).notNull(),
    expires: timestamp("expires", { mode: "date" }),
    accessToken: text("accessToken").notNull(),
});

export const videoTable = pgTable("video", {
    id: text("id").primaryKey(),
    shop: text("shop").notNull(),
    state: text("state").notNull(),
    isOnline: boolean("isOnline").default(false).notNull(),
    expires: timestamp("expires", { mode: "date" }),
    accessToken: text("accessToken").notNull(),
});

export type ShopifySessionTable = typeof sessionTable;
