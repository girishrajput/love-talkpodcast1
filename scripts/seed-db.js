const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local if present
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

async function seedDatabase() {
  console.log(`Connecting to MySQL server at ${host}:${port} as ${user}...`);
  
  let connection;
  try {
    // Initial connection without database selection to allow CREATE DATABASE
    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true
    });
    
    console.log('Connected to MySQL server successfully.');

    // 1. Run Schema
    console.log('Applying database schema (schema_mysql.sql)...');
    const schemaSql = fs.readFileSync(path.join(__dirname, '../schema_mysql.sql'), 'utf8');
    await connection.query(schemaSql);
    console.log('Schema applied successfully.');

    // 2. Run Seed Data
    console.log('Seeding initial data (seed_mysql.sql)...');
    const seedSql = fs.readFileSync(path.join(__dirname, './seed_mysql.sql'), 'utf8');
    await connection.query(seedSql);
    console.log('Data seeded successfully!');

    // 3. Output counts
    await connection.changeUser({ database });
    const [profiles] = await connection.query('SELECT COUNT(*) as count FROM profiles');
    const [episodes] = await connection.query('SELECT COUNT(*) as count FROM episodes');
    const [plans] = await connection.query('SELECT COUNT(*) as count FROM membership_plans');
    const [comments] = await connection.query('SELECT COUNT(*) as count FROM comments');
    
    console.log(`\nVerification Summary:`);
    console.log(`- Profiles/Users created: ${profiles[0].count}`);
    console.log(`- Episodes created: ${episodes[0].count}`);
    console.log(`- Membership Plans created: ${plans[0].count}`);
    console.log(`- Comments created: ${comments[0].count}`);
    console.log('\nMySQL Database setup and seeding complete!');

  } catch (error) {
    console.error('Error seeding MySQL database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedDatabase();
