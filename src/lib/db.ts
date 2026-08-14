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

/**
 * Execute a MySQL query with parameters
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T;
  } catch (error: any) {
    console.error('MySQL Query Error:', error);
    throw new Error(error.message || 'Database query execution failed');
  }
}

export default pool;
