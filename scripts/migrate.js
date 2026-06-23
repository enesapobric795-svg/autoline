const { readFileSync } = require('fs');
const { Client } = require('pg');
const path = require('path');

async function run() {
  const sqlPath = path.resolve(__dirname, '..', 'db', 'create_parts.sql');
  const sql = readFileSync(sqlPath, 'utf8');
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('Please set DATABASE_URL env var to your Supabase Postgres connection string.');
    process.exit(1);
  }

  const client = new Client({ connectionString: dbUrl });
  try {
    await client.connect();
    console.log('Connected to Postgres, running migration...');
    await client.query(sql);
    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  run();
}

module.exports = { run };
