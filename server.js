require("dotenv").config();
console.log(process.env.MYSQLHOST);
console.log(process.env.MYSQLDATABASE);
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// MySQL connection
const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

console.log("MYSQLHOST =", process.env.MYSQLHOST);
console.log("MYSQLPORT =", process.env.MYSQLPORT);
console.log("MYSQLUSER =", process.env.MYSQLUSER);
console.log("MYSQLDATABASE =", process.env.MYSQLDATABASE);

db.connect(err => {
    if (err) {
        console.error("DB connection failed:", err);
    } else {
        console.log("Connected to MySQL");
        console.log("DB NAME:", process.env.MYSQLDATABASE);
    }
});

app.get("/test", (req, res) => {
    res.json({ ok: true });
});

// Get seat availability
app.get("/timeslots", (req, res) => {

    const query = `
        SELECT t.id, t.time, t.capacity, COUNT(s.timeslot_id) AS booked
        FROM timeslots t
        LEFT JOIN students s ON t.id = s.timeslot_id
        GROUP BY t.id, t.time, t.capacity
        ORDER BY t.id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.log("TIMESLOT ERROR:", err);
            return res.status(500).json(err);
        }

        const slots = results.map(row => ({
            timeslot: row.id,
            time: row.time,
            remaining: row.capacity - row.booked
        }));

        res.json(slots);
    });

});


// Register student
app.post("/register", (req, res) => {
    const { id, first_name, last_name, project_title, email, phone, timeslot_id } = req.body;

    // check if student exists
    const checkQuery = "SELECT * FROM students WHERE id = ?";

    db.query(checkQuery, [id], (err, results) => {
        if (err) {
            console.log("REGISTER ERROR:", err);
            return res.status(500).json(err);
        }

        if (results.length > 0) {
            // already exists → update
            const updateQuery = `
                UPDATE students
                SET first_name=?, last_name=?, project_title=?, email=?, phone=?, timeslot_id=?
                WHERE id=?
            `;

            db.query(updateQuery,
                [first_name, last_name, project_title, email, phone, timeslot_id, id],
                (err) => {
                    if (err) return res.status(500).send(err);
                    res.json({ message: "Updated registration" });
                }
            );

        } else {
            // insert new
            const insertQuery = `
                INSERT INTO students
                (id, first_name, last_name, project_title, email, phone, timeslot_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(insertQuery,
                [id, first_name, last_name, project_title, email, phone, timeslot_id],
                (err) => {
                    if (err) return res.status(500).send(err);
                    res.json({ message: "Registered successfully" });
                }
            );
        }
    });
});


// Get all students
app.get("/students", (req, res) => {
    db.query("SELECT * FROM students", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});