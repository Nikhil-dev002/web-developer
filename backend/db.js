require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "portfolio_db",
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection and auto-create contacts table if it doesn't exist
pool.getConnection((err, connection) => {
    if (err) {
        console.error("MySQL connection error:", err.message);
        console.info("💡 Note: If MySQL is not running or credentials differ, please check .env file.");
        return;
    }

    console.log("MySQL pool connected successfully!");

    const createTableSql = `
        CREATE TABLE IF NOT EXISTS contacts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    connection.query(createTableSql, (tableErr) => {
        connection.release();
        if (tableErr) {
            console.error("Error creating contacts table:", tableErr.message);
        } else {
            console.log("Table 'contacts' ready.");
        }
    });
});

module.exports = pool;