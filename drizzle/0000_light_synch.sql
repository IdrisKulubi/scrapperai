CREATE TYPE "public"."sector" AS ENUM('energy', 'agriculture', 'water', 'other');--> statement-breakpoint
CREATE TABLE "scraped_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"source" text NOT NULL,
	"raw_html" text,
	"content" text NOT NULL,
	"ai_response" jsonb NOT NULL,
	"relevant" boolean NOT NULL,
	"sector" "sector" NOT NULL,
	"relevance_score" integer NOT NULL,
	"deadline" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "scraper_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"selector_version" text NOT NULL,
	"last_successful_run" timestamp,
	CONSTRAINT "scraper_versions_source_unique" UNIQUE("source")
);
