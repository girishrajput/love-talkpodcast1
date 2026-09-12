/**
 * Standalone Database Migration Script
 * Runs all DDL table initialization against the configured MySQL database.
 * Usage: node scripts/migrate.js
 */

const mysql = require('mysql2/promise');

async function runMigrations() {
  console.log('🚀 Starting Love Talk Podcast database migrations...');

  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lovetalkpodcast',
    waitForConnections: true,
    connectionLimit: 5,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  });

  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database successfully.');
    connection.release();

    // 1. Profiles Table
    console.log('📦 Migrating table: profiles...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`profiles\` (
        \`id\` VARCHAR(36) PRIMARY KEY,
        \`auth_user_id\` VARCHAR(255) UNIQUE NOT NULL,
        \`email\` VARCHAR(255) UNIQUE NOT NULL,
        \`name\` VARCHAR(255) NOT NULL,
        \`avatar_url\` TEXT,
        \`role\` ENUM('user', 'admin', 'super_admin') NOT NULL DEFAULT 'user',
        \`status\` ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`last_login\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX \`idx_profiles_email\` (\`email\`),
        INDEX \`idx_profiles_role\` (\`role\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Membership Plans Table
    console.log('📦 Migrating table: membership_plans...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`membership_plans\` (
        \`id\` VARCHAR(36) PRIMARY KEY,
        \`name\` VARCHAR(255) NOT NULL,
        \`slug\` VARCHAR(255) UNIQUE NOT NULL,
        \`target_audience\` VARCHAR(255) NOT NULL,
        \`price\` DECIMAL(10, 2) NOT NULL,
        \`currency\` VARCHAR(10) DEFAULT 'INR',
        \`billing_period\` VARCHAR(20) DEFAULT 'year',
        \`discounted_price\` DECIMAL(10, 2),
        \`is_active\` BOOLEAN DEFAULT TRUE,
        \`is_featured\` BOOLEAN DEFAULT FALSE,
        \`badge\` VARCHAR(100),
        \`benefits\` JSON,
        \`razorpay_plan_id\` VARCHAR(255),
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX \`idx_plans_slug\` (\`slug\`),
        INDEX \`idx_plans_active\` (\`is_active\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Memberships Table
    console.log('📦 Migrating table: memberships...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`memberships\` (
        \`id\` VARCHAR(36) PRIMARY KEY,
        \`user_id\` VARCHAR(36) NOT NULL,
        \`plan_id\` VARCHAR(36),
        \`status\` ENUM('active', 'pending', 'expired', 'cancelled', 'failed', 'paused') NOT NULL DEFAULT 'pending',
        \`razorpay_customer_id\` VARCHAR(255),
        \`razorpay_subscription_id\` VARCHAR(255),
        \`start_date\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`end_date\` DATETIME NOT NULL,
        \`auto_renew\` BOOLEAN DEFAULT TRUE,
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX \`idx_memberships_user_id\` (\`user_id\`),
        INDEX \`idx_memberships_status\` (\`status\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. Payments Table
    console.log('📦 Migrating table: payments...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`payments\` (
        \`id\` VARCHAR(36) PRIMARY KEY,
        \`user_id\` VARCHAR(36) NOT NULL,
        \`membership_id\` VARCHAR(36),
        \`razorpay_payment_id\` VARCHAR(255) UNIQUE NOT NULL,
        \`razorpay_order_id\` VARCHAR(255) NOT NULL,
        \`razorpay_subscription_id\` VARCHAR(255),
        \`amount\` DECIMAL(10, 2) NOT NULL,
        \`currency\` VARCHAR(10) DEFAULT 'INR',
        \`status\` ENUM('captured', 'failed', 'refunded', 'pending') NOT NULL,
        \`payment_method\` VARCHAR(50) DEFAULT 'upi',
        \`paid_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX \`idx_payments_order\` (\`razorpay_order_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. Membership Orders Table
    console.log('📦 Migrating table: membership_orders...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`membership_orders\` (
        \`id\` VARCHAR(36) PRIMARY KEY,
        \`user_id\` VARCHAR(36) NOT NULL,
        \`plan_id\` VARCHAR(36) NOT NULL,
        \`razorpay_order_id\` VARCHAR(255) UNIQUE NOT NULL,
        \`amount\` DECIMAL(10, 2) NOT NULL,
        \`currency\` VARCHAR(10) DEFAULT 'INR',
        \`status\` ENUM('created', 'pending', 'paid', 'failed', 'cancelled') NOT NULL DEFAULT 'created',
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX \`idx_membership_orders_user\` (\`user_id\`),
        INDEX \`idx_membership_orders_rzp\` (\`razorpay_order_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 6. Webhook Events Table
    console.log('📦 Migrating table: webhook_events...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`webhook_events\` (
        \`id\` VARCHAR(36) PRIMARY KEY,
        \`event_id\` VARCHAR(255) UNIQUE NOT NULL,
        \`event_type\` VARCHAR(100) NOT NULL,
        \`payload\` JSON NOT NULL,
        \`processed\` BOOLEAN DEFAULT FALSE,
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX \`idx_webhook_event\` (\`event_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 7. Episodes Table
    console.log('📦 Migrating table: episodes...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`episodes\` (
        \`id\` VARCHAR(36) PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`episode_number\` INT UNIQUE NOT NULL,
        \`slug\` VARCHAR(255) UNIQUE NOT NULL,
        \`description\` TEXT NOT NULL,
        \`audio_url\` TEXT NOT NULL,
        \`audio_duration\` INT NOT NULL,
        \`cover_image\` TEXT NOT NULL,
        \`language\` ENUM('english', 'hindi', 'bilingual') DEFAULT 'english',
        \`tags\` JSON,
        \`publish_date\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`is_published\` BOOLEAN DEFAULT TRUE,
        \`access_type\` ENUM('FREE', 'PREMIUM') NOT NULL DEFAULT 'FREE',
        \`preview_duration\` INT DEFAULT 60,
        \`transcript_en\` MEDIUMTEXT,
        \`transcript_hi\` MEDIUMTEXT,
        \`listens_count\` INT DEFAULT 0,
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX \`idx_episodes_slug\` (\`slug\`),
        INDEX \`idx_episodes_access_type\` (\`access_type\`),
        INDEX \`idx_episodes_published\` (\`is_published\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('🎉 All database migrations completed successfully!');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
}

runMigrations();
