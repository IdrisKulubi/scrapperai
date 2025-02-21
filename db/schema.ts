import { pgTable, serial, text, timestamp, boolean, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { vector } from 'drizzle-orm/pg-core';

export const sectorEnum = pgEnum('sector', ['energy', 'agriculture', 'water', 'other']);

export const scrapedData = pgTable('scraped_data', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  source: text('source').notNull(),
  rawHtml: text('raw_html'),
  content: text('content').notNull(),
  aiResponse: jsonb('ai_response').notNull(),
  relevant: boolean('relevant').notNull(),
  sector: sectorEnum('sector').notNull(),
  relevanceScore: integer('relevance_score').notNull(),
  deadline: timestamp('deadline'),
  embeddings: vector('embeddings', { dimensions: 1536 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const scraperVersions = pgTable('scraper_versions', {
  id: serial('id').primaryKey(),
  source: text('source').notNull().unique(),
  selectorVersion: text('selector_version').notNull(),
  lastSuccessfulRun: timestamp('last_successful_run'),
});
