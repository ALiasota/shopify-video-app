CREATE TYPE "public"."slider_placement_type" AS ENUM('hone', 'product', 'collection');--> statement-breakpoint
CREATE TYPE "public"."slider_status" AS ENUM('active', 'draft');--> statement-breakpoint
ALTER TYPE "public"."video_layout_type" RENAME TO "slider_layout_type";--> statement-breakpoint
ALTER TABLE "sliders" ADD COLUMN "status" "slider_status" NOT NULL;--> statement-breakpoint
ALTER TABLE "sliders" ADD COLUMN "handle" text NOT NULL;--> statement-breakpoint
ALTER TABLE "sliders" ADD COLUMN "placement" "slider_placement_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "sliders" ADD COLUMN "videos_per_row" numeric NOT NULL;