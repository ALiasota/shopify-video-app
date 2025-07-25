import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const merchantTable = pgTable("merchant", {
    id: serial("id").primaryKey(),
    shop: text("shop").notNull().unique(),
    shopId: text("shop_id").notNull(),
    email: text("email").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }),
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
    shopifyVideoId: text("shopify_video_id").notNull(),
    thumbnailUrl: text("thumbnail_url").notNull(),
    videoUrl: text("video_url").notNull(),
    filename: text("filename").notNull(),
    duration: text("duration").notNull(),
    format: text("format").notNull(),
    size: text("size").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }),
});

export const videoLayoutTypeEnum = pgEnum("video_layout_type", ["carousel", "stack", "single", "thumbnails"]);

export const videoSliderTable = pgTable("video_slider", {
    id: text("id").primaryKey(),
    merchantId: integer("merchant_id")
        .references(() => merchantTable.id, { onDelete: "cascade" })
        .notNull(),
    title: text("title").notNull(),
    layout: videoLayoutTypeEnum("layout").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }),
});

export const videoSliderItemTable = pgTable("video_slider_item", {
    id: text("id").primaryKey(),
    sliderId: integer("slider_id")
        .references(() => videoSliderTable.id, { onDelete: "cascade" })
        .notNull(),
    videoId: integer("video_id")
        .references(() => videoTable.id, { onDelete: "cascade" })
        .notNull(),
    shopifyVideoId: text("shopify_product_id").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }),
});

export const merchantTableRelations = relations(merchantTable, ({ many }) => ({
    videos: many(videoTable),
    sliders: many(videoSliderTable),
}));

export const videoTableRelations = relations(videoTable, ({ one, many }) => ({
    merchant: one(merchantTable, {
        fields: [videoTable.merchantId],
        references: [merchantTable.id],
    }),
    sliderItems: many(videoSliderItemTable),
}));

export const videoSliderTableRelations = relations(videoSliderTable, ({ one, many }) => ({
    merchant: one(merchantTable, {
        fields: [videoSliderTable.merchantId],
        references: [merchantTable.id],
    }),
    sliderItems: many(videoSliderItemTable),
}));

export const videoSliderItemTableRelations = relations(videoSliderItemTable, ({ one }) => ({
    slider: one(videoSliderTable, {
        fields: [videoSliderItemTable.sliderId],
        references: [videoSliderTable.id],
    }),
    video: one(videoTable, {
        fields: [videoSliderItemTable.videoId],
        references: [videoTable.id],
    }),
}));

export type ShopifySessionTable = typeof sessionTable;
