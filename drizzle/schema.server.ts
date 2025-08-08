import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { boolean, decimal, integer, pgEnum, pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const merchantsTable = pgTable("merchants", {
    id: serial("id").primaryKey(),
    shop: text("shop").notNull().unique(),
    shopId: text("shop_id").notNull(),
    email: text("email").notNull(),
    currencyCode: text("currency_code").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }),
});

export const sessionsTable = pgTable("sessions", {
    id: text("id").primaryKey(),
    shop: text("shop").notNull(),
    state: text("state").notNull(),
    isOnline: boolean("isOnline").default(false).notNull(),
    expires: timestamp("expires", { mode: "date" }),
    accessToken: text("accessToken").notNull(),
});

export const productsTable = pgTable("products", {
    id: uuid("id").primaryKey().defaultRandom(),
    merchantId: integer("merchant_id")
        .references(() => merchantsTable.id, { onDelete: "cascade" })
        .notNull(),
    shopifyProductId: text("shopify_product_id").notNull(),
    title: text("title").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    price: decimal("price"),
    compareAtPrice: decimal("compare_at_price"),
    handle: text("handle").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }),
});

export const videoStatusEnum = pgEnum("video_status", ["FAILED", "PROCESSING", "READY", "UPLOADED"]);

export const videosTable = pgTable("videos", {
    id: uuid("id").primaryKey().defaultRandom(),
    merchantId: integer("merchant_id")
        .references(() => merchantsTable.id, { onDelete: "cascade" })
        .notNull(),
    shopifyVideoId: text("shopify_video_id").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    videoUrl: text("video_url"),
    filename: text("filename").notNull(),
    duration: integer("duration"),
    format: text("format"),
    size: integer("size"),
    width: integer("width"),
    height: integer("height"),
    status: videoStatusEnum("status").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }),
});

export const sliderLayoutTypeEnum = pgEnum("slider_layout_type", ["carousel", "stack", "single", "thumbnails"]);
export const sliderStatusEnum = pgEnum("slider_status", ["active", "draft"]);
export const sliderPlacementTypeEnum = pgEnum("slider_placement_type", ["home", "product", "collection"]);

export const slidersTable = pgTable("sliders", {
    id: uuid("id").primaryKey().defaultRandom(),
    merchantId: integer("merchant_id")
        .references(() => merchantsTable.id, { onDelete: "cascade" })
        .notNull(),
    status: sliderStatusEnum("status").notNull(),
    title: text("title").notNull(),
    handle: text("handle").notNull(),
    layout: sliderLayoutTypeEnum("layout").notNull(),
    placement: sliderPlacementTypeEnum("placement").notNull(),
    videosPerRow: decimal("videos_per_row").notNull(),
    autoScrollSeconds: decimal("auto_scroll_seconds").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }),
});

export const slidesTable = pgTable("slides", {
    id: uuid("id").primaryKey().defaultRandom(),
    sliderId: uuid("slider_id")
        .references(() => slidersTable.id, { onDelete: "cascade" })
        .notNull(),
    videoId: uuid("video_id")
        .references(() => videosTable.id, { onDelete: "cascade" })
        .notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }),
});

export const productVariantsTable = pgTable("product_variants", {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
        .references(() => productsTable.id, { onDelete: "cascade" })
        .notNull(),
    slideId: uuid("slide_id")
        .references(() => slidesTable.id, { onDelete: "cascade" })
        .notNull(),
    shopifyVariantId: text("shopify_product_id").notNull(),
    title: text("title").notNull(),
    price: decimal("price").notNull(),
    compareAtPrice: decimal("compare_at_price"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }),
});

export const merchantsTableRelations = relations(merchantsTable, ({ many }) => ({
    videos: many(videosTable),
    products: many(productsTable),
    sliders: many(slidersTable),
}));

export const videosTableRelations = relations(videosTable, ({ one, many }) => ({
    merchant: one(merchantsTable, {
        fields: [videosTable.merchantId],
        references: [merchantsTable.id],
    }),
    slides: many(slidesTable),
}));

export const productsTableRelations = relations(productsTable, ({ one, many }) => ({
    merchant: one(merchantsTable, {
        fields: [productsTable.merchantId],
        references: [merchantsTable.id],
    }),
    variants: many(productVariantsTable),
}));

export const slidersTableRelations = relations(slidersTable, ({ one, many }) => ({
    merchant: one(merchantsTable, {
        fields: [slidersTable.merchantId],
        references: [merchantsTable.id],
    }),
    slides: many(slidesTable),
}));

export const slidesTableRelations = relations(slidesTable, ({ one }) => ({
    slider: one(slidersTable, {
        fields: [slidesTable.sliderId],
        references: [slidersTable.id],
    }),
    video: one(videosTable, {
        fields: [slidesTable.videoId],
        references: [videosTable.id],
    }),
    variant: one(productVariantsTable, {
        fields: [slidesTable.id],
        references: [productVariantsTable.slideId],
    }),
}));

export const productVariantsTableRelations = relations(productVariantsTable, ({ one }) => ({
    product: one(productsTable, {
        fields: [productVariantsTable.productId],
        references: [productsTable.id],
    }),
    slide: one(slidesTable, {
        fields: [productVariantsTable.slideId],
        references: [slidesTable.id],
    }),
}));

export type ShopifySessionTable = typeof sessionsTable;

export type InsertVideo = InferInsertModel<typeof videosTable>;

export type VideoDB = InferSelectModel<typeof videosTable>;

export type SliderDB = InferSelectModel<typeof slidersTable>;

export type SlideDB = InferSelectModel<typeof slidesTable>;

export type ProductDB = InferSelectModel<typeof productsTable>;

export type ProductVariantDB = InferSelectModel<typeof productVariantsTable>;
