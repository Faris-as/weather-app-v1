import { migrate } from 'drizzle-orm/node-postgres/migrator';
import path from 'node:path';
import { Database } from '../types';

export function getDatabaseMigrator(db: Database) {
  return {
    run: async () => {
      migrate(db, {
        migrationsFolder: path.resolve(__dirname, '../../migrations'),
      });
    },
  };
}
