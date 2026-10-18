import fs from 'fs';
import path from 'path';
import pg from 'pg';

const { Client } = pg;

const client = new Client({
  host: 'db.gjsdwangzyvbpyyhisor.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Kishor@123!',
  ssl: { rejectUnauthorized: false },
});

async function runMigration() {
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL!');

    const sqlPath = path.join(process.cwd(), 'supabase', 'complete_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing complete_schema.sql...');
    await client.query(sql);
    console.log('complete_schema.sql executed successfully!');

    // Verify created tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('Created Tables:');
    res.rows.forEach(r => console.log(' - ' + r.table_name));

    // Check row counts
    const markets = await client.query('SELECT count(*) FROM markets');
    const crops = await client.query('SELECT count(*) FROM crops');
    const profiles = await client.query('SELECT count(*) FROM profiles');
    console.log(`Verified data: ${markets.rows[0].count} markets, ${crops.rows[0].count} crops, ${profiles.rows[0].count} profiles.`);

    await client.end();
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigration();
