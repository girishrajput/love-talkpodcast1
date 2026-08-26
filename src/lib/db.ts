import mysql from 'mysql2/promise';

// Create a connection pool to MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'lovetalkpodcast',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

let tablesInitialized = false;

async function ensureTablesExist() {
  if (tablesInitialized) return;
  try {
    tablesInitialized = true;
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
  } catch (err) {
    console.warn('Auto table initialization warning:', err);
  }
}

/**
 * Execute a MySQL query with parameters
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T> {
  try {
    await ensureTablesExist();
    const [rows] = await pool.execute(sql, params);
    return rows as T;
  } catch (error: any) {
    console.error('MySQL Query Error:', error);
    throw new Error(error.message || 'Database query execution failed');
  }
}

export default pool;
