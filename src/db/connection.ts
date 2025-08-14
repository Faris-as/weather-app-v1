import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { Database } from '../types';

export function getDatabaseConnection(connectionString: string): Database {
  const pool = new Pool({ connectionString });
  const db = drizzle({ client: pool, schema });
  return db;
}
