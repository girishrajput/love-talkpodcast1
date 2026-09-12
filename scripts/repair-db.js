const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
}

const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT || '3306', 10);
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '';
const database = process.env.DB_NAME || 'lovetalkpodcast';

async function repairAndSeed() {
  console.log(`Connecting to MySQL server at ${host}:${port}...`);
  let connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
    multipleStatements: true
  });

  try {
    console.log(`Dropping and recreating database ${database}...`);
    await connection.query(`DROP DATABASE IF EXISTS \`${database}\`;`);
    await connection.query(`CREATE DATABASE \`${database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE \`${database}\`;`);

    console.log('Applying database schema (schema_mysql.sql)...');
    const schemaSql = fs.readFileSync(path.join(__dirname, '../schema_mysql.sql'), 'utf8');
    await connection.query(schemaSql);
    console.log('Schema applied successfully.');

    console.log('Seeding initial data (seed_mysql.sql)...');
    const seedSql = fs.readFileSync(path.join(__dirname, './seed_mysql.sql'), 'utf8');
    await connection.query(seedSql);
    console.log('Data seeded successfully!');

    const [profiles] = await connection.query('SELECT COUNT(*) as count FROM profiles');
    const [episodes] = await connection.query('SELECT COUNT(*) as count FROM episodes');
    const [plans] = await connection.query('SELECT COUNT(*) as count FROM membership_plans');

    console.log(`\nVerification Summary:`);
    console.log(`- Profiles: ${profiles[0].count}`);
    console.log(`- Episodes: ${episodes[0].count}`);
    console.log(`- Plans: ${plans[0].count}`);
    console.log('\nMySQL repair and seed complete!');
  } catch (err) {
    console.error('Error during repair and seed:', err.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

repairAndSeed();
