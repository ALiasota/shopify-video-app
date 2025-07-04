CREATE TABLE "merchant" (
	"id" serial PRIMARY KEY NOT NULL,
	"shop" text NOT NULL,
	"shop_id" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "merchant_shop_unique" UNIQUE("shop")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"shop" text NOT NULL,
	"state" text NOT NULL,
	"isOnline" boolean DEFAULT false NOT NULL,
	"expires" timestamp,
	"accessToken" text NOT NULL
);
