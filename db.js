const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

function makePool(dbName) {
  return mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: dbName,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

async function query(sql, params) {
  if (!pool) {
    pool = makePool(process.env.DB_NAME || 'ubrs');
  }
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function init() {
  const dbName = process.env.DB_NAME || 'ubrs';

  // First try to ensure database exists. If connecting with database fails because
  // the database doesn't exist, create it using a temporary connection without database.
  try {
    pool = makePool(dbName);
    // Test a simple query
    await pool.query('SELECT 1');
  } catch (err) {
    // If connection refused or cannot connect, rethrow so caller can handle it
    if (err.code === 'ECONNREFUSED' || err.errno === 'ECONNREFUSED') {
      throw err;
    }

    // Try to create database if it's a "unknown database" error
    try {
      const tempConn = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306
      });
      await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
      await tempConn.end();
      // recreate pool with database
      pool = makePool(dbName);
    } catch (err2) {
      // bubble up the original error if creating DB failed
      throw err2 || err;
    }
  }

  // Create bookings table if it doesn't exist
  const create = `
    CREATE TABLE IF NOT EXISTS bookings (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      registerNumber VARCHAR(128) NOT NULL,
      department VARCHAR(128) NOT NULL,
      from_location VARCHAR(255) NOT NULL,
      to_location VARCHAR(255) NOT NULL,
      date VARCHAR(50) NOT NULL,
      seat VARCHAR(16) NOT NULL,
      timing VARCHAR(128),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `;

  await query(create);
}

module.exports = { pool, query, init };
