require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Portfolio Backend is Running!");
});

// Health check route
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date() });
});

// Contact form API
app.post("/api/contact", (req, res) => {
    const { name, email, message } = req.body;

    // Check required fields
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "Please fill all fields."
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
                console.error("Database error:", err);
                return res.status(500).json({
                    success: false,
                    message: "Database error. Please try again later."
                });
            }

            return res.status(200).json({
                success: true,
                message: "Message sent successfully!"
            });
        }
    );
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});