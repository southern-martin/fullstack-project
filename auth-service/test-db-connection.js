const mysql = require('mysql2/promise');

async function testConnection() {
    try {
        console.log('Testing database connection...');

        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            port: 7777,
            user: 'root',
            password: '',
            database: 'auth_service_db'
        });

        console.log('✅ Database connection successful!');

        // Test a simple query
        const [rows] = await connection.execute('SELECT 1 as test');
        console.log('✅ Query test successful:', rows);

        await connection.end();
        console.log('✅ Connection closed successfully');

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();
