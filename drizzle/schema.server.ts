import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

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
    merchantId: integer("merchant_id")
        .references(() => merchantTable.id, { onDelete: "cascade" })
        .notNull(),
    videoId: text("video_id").notNull(),
    thumbnailUrl: text("shop").notNull(),
    videoUrl: text("shop").notNull(),
    filename: text("shop").notNull(),
    duration: text("shop").notNull(),
    format: text("shop").notNull(),
    size: text("shop").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export const videoLayoutTypeEnum = pgEnum("video_layout_type", ["carousel", "stack", "single", "thumbnails"]);

export const videoSliderTable = pgTable("video_slider", {
    id: text("id").primaryKey(),
    merchantId: integer("merchant_id")
        .references(() => merchantTable.id, { onDelete: "cascade" })
        .notNull(),
    title: text("video_id").notNull(),
    layout: videoLayoutTypeEnum("layout").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export const videoSliderItemTable = pgTable("video_slider_item", {
    id: text("id").primaryKey(),
    title: text("video_id").notNull(),
    layout: videoLayoutTypeEnum("layout").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export const merchantTableRelations = relations(merchantTable, ({ many }) => ({
    videos: many(videoTable),
    sliders: many(videoSliderTable),
}));

export const videoTableRelations = relations(videoTable, ({ one }) => ({
    merchant: one(merchantTable, {
        fields: [videoTable.merchantId],
        references: [merchantTable.id],
    }),
}));

export const videoSliderTableRelations = relations(videoSliderTable, ({ one }) => ({
    merchant: one(merchantTable, {
        fields: [videoSliderTable.merchantId],
        references: [merchantTable.id],
    }),
}));

export type ShopifySessionTable = typeof sessionTable;
