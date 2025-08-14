import 'dotenv/config';
import { getDatabaseConnection } from '../db/connection.js';
import { getDatabaseMigrator } from '../modules/migrator.js';

async function main() {
  const db = getDatabaseConnection(process.env.DATABASE_URL!);
  const migrator = getDatabaseMigrator(db);

  await migrator.run();
  console.log('✅ Migrations completed');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
