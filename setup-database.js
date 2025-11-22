require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupDatabase() {
  let connection;

  try {
    // Create connection without database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'kamer_tech_mall';
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`Database '${dbName}' created or already exists`);

    // Use the database
    await connection.query(`USE ${dbName}`);

    // Create sellers table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sellers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        business_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        verified BOOLEAN DEFAULT FALSE,
        status ENUM('pending', 'active', 'suspended') DEFAULT 'pending',
        role ENUM('seller', 'admin') DEFAULT 'seller',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_username (username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('Sellers table created successfully');

    // Check and add missing columns for sellers (Schema Migration)
    const [sellerColumns] = await connection.query('SHOW COLUMNS FROM sellers');
    const sellerColumnNames = sellerColumns.map(c => c.Field);

    if (!sellerColumnNames.includes('role')) {
      await connection.query("ALTER TABLE sellers ADD COLUMN role ENUM('seller', 'admin') DEFAULT 'seller'");
      console.log('Added missing column: role');
    }
    if (!sellerColumnNames.includes('status')) {
      await connection.query("ALTER TABLE sellers ADD COLUMN status ENUM('pending', 'active', 'suspended') DEFAULT 'pending'");
      console.log('Added missing column: status');
    }
    if (!sellerColumnNames.includes('verified')) {
      await connection.query("ALTER TABLE sellers ADD COLUMN verified BOOLEAN DEFAULT FALSE");
      console.log('Added missing column: verified');
    }

    // Create seller_sessions table for enhanced security
    await connection.query(`
      CREATE TABLE IF NOT EXISTS seller_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        seller_id INT NOT NULL,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE,
        INDEX idx_session_token (session_token),
        INDEX idx_seller_id (seller_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('Seller sessions table created successfully');

    // Create products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        seller_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        status ENUM('published', 'draft', 'archived') DEFAULT 'draft',
        old_price DECIMAL(12, 2),
        new_price DECIMAL(12, 2),
        current_price DECIMAL(12, 2) NOT NULL,
        quantity INT DEFAULT 0,
        size VARCHAR(100),
        color VARCHAR(100),
        location VARCHAR(255),
        shop_name VARCHAR(255),
        supplier_phone VARCHAR(20),
        supplier_whatsapp VARCHAR(20),
        featured_photo TEXT,
        other_photos TEXT,
        description TEXT,
        features TEXT,
        conditions TEXT,
        return_policy TEXT,
        is_featured BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE,
        INDEX idx_seller_id (seller_id),
        INDEX idx_status (status),
        INDEX idx_category (category),
        INDEX idx_is_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('Products table created successfully');

    console.log('\n✅ Database setup completed successfully!');
    console.log('You can now run: npm start');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();

