import {
  date,
  decimal,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

// Locations Table
// --------------------
export const locations = pgTable('locations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  latitude: decimal('latitude', { precision: 9, scale: 6 }),
  longitude: decimal('longitude', { precision: 9, scale: 6 }),
  country: text('country'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// --------------------
// Weather Queries Table
// --------------------
export const weather_queries = pgTable('weather_queries', {
  id: uuid('id').primaryKey().defaultRandom(),
  location_id: uuid('location_id')
    .notNull()
    .references(() => locations.id, { onDelete: 'cascade' }),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  temperature_data: jsonb('temperature_data').notNull(), // stores API response for date range
  created_at: timestamp('created_at').defaultNow().notNull(),
});
