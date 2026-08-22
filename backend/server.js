const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend portfolio files
app.use(express.static(path.join(__dirname, "..")));

// Health check route
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", server: "running", timestamp: new Date() });
});

// Contact form API
app.post("/api/contact", (req, res) => {
    const { name, email, message } = req.body;

    // Check required fields
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "Please fill in all fields (name, email, and message)."
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address."
        });
    }

    const sql = `
        INSERT INTO contacts (name, email, message)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [name.trim(), email.trim(), message.trim()],
        (err, result) => {
            if (err) {
                console.error("MySQL Database error:", err);
                return res.status(500).json({
                    success: false,
                    message: "Database error: Unable to save message to MySQL."
                });
            }

            console.log(`[Contact] Message saved from: ${name} <${email}> (ID: ${result.insertId})`);

            return res.status(200).json({
                success: true,
                message: "Message sent successfully!",
                id: result.insertId
            });
        }
    );
});

// Fallback to index.html for root if not served by static
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Portfolio Server running at http://localhost:${PORT}`);
    console.log(`🌐 Open http://localhost:${PORT} in your browser`);
    console.log(`=========================================`);
});