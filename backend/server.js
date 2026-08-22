const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Portfolio Backend is Running!");
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

    const sql = `
        INSERT INTO contacts (name, email, message)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [name, email, message],
        (err, result) => {

            if (err) {
                console.error("Database error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Database error."
                });
            }

            res.json({
                success: true,
                message: "Message sent successfully!"
            });
        }
    );
});

// Start server
app.listen(5000, () => {
    console.log("Server running at http://localhost:5000");
});dir