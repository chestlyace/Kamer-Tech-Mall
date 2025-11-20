require('dotenv').config();
const mysql = require('mysql2/promise');
const { dbType } = require('./config/database');

async function makeAdmin(email) {
    let connection;
    try {
        if (dbType === 'mysql') {
            connection = await mysql.createConnection({
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || 3306,
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'kamer_tech_mall'
            });

            const [rows] = await connection.execute('SELECT * FROM sellers WHERE email = ?', [email]);

            if (rows.length === 0) {
                console.log(`❌ User with email '${email}' not found.`);
                return;
            }

            await connection.execute('UPDATE sellers SET role = ? WHERE email = ?', ['admin', email]);
            console.log(`✅ User '${email}' has been promoted to ADMIN.`);
        } else {
            console.log('This script currently supports MySQL only. For Supabase, please use the dashboard.');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

const email = process.argv[2];
if (!email) {
    console.log('Usage: node create-admin.js <email>');
    process.exit(1);
}

makeAdmin(email);
