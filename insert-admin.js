require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
    const args = process.argv.slice(2);

    if (args.length < 4) {
        console.log('Usage: node insert-admin.js <username> <email> <password> <business_name>');
        process.exit(1);
    }

    const [username, email, password, businessName] = args;
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'kamer_tech_mall'
        });

        // Check if user already exists
        const [existingUsers] = await connection.execute(
            'SELECT * FROM sellers WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existingUsers.length > 0) {
            console.error('❌ Error: User with this email or username already exists.');
            process.exit(1);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert new admin user
        await connection.execute(
            `INSERT INTO sellers (
        username, 
        email, 
        password_hash, 
        business_name, 
        role, 
        status, 
        verified
      ) VALUES (?, ?, ?, ?, 'admin', 'active', true)`,
            [username, email, passwordHash, businessName]
        );

        console.log(`✅ Admin user '${username}' (${email}) created successfully!`);

    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

createAdminUser();
