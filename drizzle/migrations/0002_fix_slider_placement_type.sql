ALTER TABLE "public"."sliders" ALTER COLUMN "placement" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."slider_placement_type";--> statement-breakpoint
CREATE TYPE "public"."slider_placement_type" AS ENUM('home', 'product', 'collection');--> statement-breakpoint
ALTER TABLE "public"."sliders" ALTER COLUMN "placement" SET DATA TYPE "public"."slider_placement_type" USING "placement"::"public"."slider_placement_type";