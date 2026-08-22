const mysql = require("mysql2/promise");

module.exports = async (req, res) => {

    // Allow your portfolio to call the API
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle browser preflight request
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed"
        });
    }

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "Please fill all fields."
        });
    }

    try {

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT || 3306)
        });

        await connection.execute(
            `INSERT INTO contacts (name, email, message)
             VALUES (?, ?, ?)`,
            [name, email, message]
        );

        await connection.end();

        return res.status(200).json({
            success: true,
            message: "Message sent successfully!"
        });

    } catch (error) {

        console.error("Database error:", error);

        return res.status(500).json({
            success: false,
            message: "Database error."
        });
    }
};