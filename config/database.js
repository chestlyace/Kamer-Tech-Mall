require('dotenv').config();
const mysql = require('mysql2/promise');
const { createClient } = require('@supabase/supabase-js');

// Database configuration based on environment
const dbType = process.env.DB_TYPE || 'mysql';

let db;

// MySQL Configuration
const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kamer_tech_mall',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Supabase Configuration
const supabaseConfig = {
  url: process.env.SUPABASE_URL,
  anonKey: process.env.SUPABASE_ANON_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
};

// Initialize database connection
async function initDatabase() {
  if (dbType === 'mysql') {
    try {
      db = mysql.createPool(mysqlConfig);
      console.log('MySQL database connected successfully');
      return db;
    } catch (error) {
      console.error('MySQL connection error:', error);
      throw error;
    }
  } else if (dbType === 'supabase') {
    try {
      db = createClient(supabaseConfig.url, supabaseConfig.anonKey);
      console.log('Supabase database connected successfully');
      return db;
    } catch (error) {
      console.error('Supabase connection error:', error);
      throw error;
    }
  }
}

// Database wrapper for unified interface
const database = {
  async query(sql, params) {
    if (dbType === 'mysql') {
      const [results] = await db.execute(sql, params);
      return results;
    } else if (dbType === 'supabase') {
      // For Supabase, we'll use their client methods
      // This is handled in the models
      throw new Error('Use Supabase client methods directly in models');
    }
  },

  async getConnection() {
    if (dbType === 'mysql') {
      return await db.getConnection();
    }
    return db;
  },

  getClient() {
    return db;
  },

  getType() {
    return dbType;
  }
};

module.exports = { initDatabase, database, dbType };

