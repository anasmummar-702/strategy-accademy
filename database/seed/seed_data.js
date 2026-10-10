/**
 * STRATEGY CONTROL CENTER — SEED DATA SCRIPT (Node.js Utility)
 * Run: `node database/seed/seed_data.js`
 * 
 * Imports seed data from SQL files or directly populates local/remote PostgreSQL instance.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeed() {
  console.log('🚀 Starting STRATEGY Database Seed Process...');

  const schemaPath = path.join(__dirname, '../schema/01_schema.sql');
  const seedPath = path.join(__dirname, '02_seed.sql');
  const triggersPath = path.join(__dirname, '../schema/03_functions_triggers.sql');

  if (!fs.existsSync(schemaPath) || !fs.existsSync(seedPath)) {
    console.error('❌ Schema or seed SQL files missing!');
    process.exit(1);
  }

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  const seedSql = fs.readFileSync(seedPath, 'utf8');
  const triggersSql = fs.readFileSync(triggersPath, 'utf8');

  console.log(`✅ Loaded DDL Schema (${schemaSql.length} bytes)`);
  console.log(`✅ Loaded Seed Content (${seedSql.length} bytes)`);
  console.log(`✅ Loaded Triggers & Functions (${triggersSql.length} bytes)`);

  console.log('\n=============================================================');
  console.log('Seed SQL Bundle ready for PostgreSQL / Supabase Migration:');
  console.log('1. Execute database/schema/01_schema.sql');
  console.log('2. Execute database/seed/02_seed.sql');
  console.log('3. Execute database/schema/03_functions_triggers.sql');
  console.log('=============================================================\n');

  console.log('🎉 Seed Preparation Complete!');
}

runSeed();
