const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require('body-parser');


const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "0.0.0.0",
    user: "root",
    password: "WNfTUAG850WBZDzV",
    database: "ilk_volgger"
});




// Aufträge abrufen
app.get("/auftraege", (req, res) => {
    const sql = "SELECT * FROM auftraege";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: "Error retrieving data" });
        return res.json(data);
    });
});

// Aufgaben für einen bestimmten Auftrag abrufen
app.get("/auftraege/:id/aufgaben", (req, res) => {
    const auftragId = req.params.id;
    const sql = "SELECT * FROM aufgaben WHERE auftrag_id = ?";
    db.query(sql, [auftragId], (err, data) => {
        if (err) return res.status(500).json({ error: "Error retrieving data" });
        return res.json(data);
    });
});

app.get("/aufgaben/status", (req, res) => {
    const sql = "SELECT * FROM aufgaben";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: "Error retrieving data" });
        return res.json(data);
    });
});

// Auftrag hinzufügen
app.post('/auftraege/create', (req, res) => {
    const { auftrag_name, auftrag_liefertermin } = req.body;
    const sql = "INSERT INTO auftraege (auftrag_name, auftrag_liefertermin) VALUES (?, ?)";
    db.query(sql, [auftrag_name, auftrag_liefertermin], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Auftrag erfolgreich hinzugefügt", ID: result.insertId });
    });
});

//Aufgabe hinzufügen
app.post('/auftraege/:id/aufgaben/create', (req, res) => {
    const auftragId = req.params.id;
    const { hoehe, breite, laenge, kammer, kapplaenge, lagenbreite, lagenhoehe, stueck, seitenware, ewd_programm, stueck_pack, zugeschnitten, kommentar } = req.body;
    const sql = "INSERT INTO aufgaben (auftrag_id, hoehe, breite, laenge, kammer, kapplaenge, lagenbreite, lagenhoehe, stueck, seitenware, ewd_programm, stueck_pack, zugeschnitten, kommentar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [auftragId, hoehe, breite, laenge, kammer, kapplaenge, lagenbreite, lagenhoehe, stueck, seitenware, ewd_programm, stueck_pack, zugeschnitten, kommentar], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Aufgabe erfolgreich hinzugefügt", ID: result.insertId });
    });
});


// Auftrag aktualisieren
app.put('/auftraege/update/:ID', (req, res) => {
    const { auftrag_name, auftrag_liefertermin } = req.body;
    const sql = "UPDATE auftraege SET auftrag_name = ?, auftrag_liefertermin = ? WHERE ID = ?";
    const id = req.params.ID;
    const values = [auftrag_name, auftrag_liefertermin, id];
    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: "Error updating entry" });
        return res.json({ message: "Entry updated successfully" });
    });
});

// Aufgabe aktualisieren
app.put('/aufgaben/update/:ID', (req, res) => {
    const { hoehe, breite, laenge, kammer, kapplaenge, lagenbreite, lagenhoehe, stueck, reihenfolge, seitenware, ewd_programm, stueck_pack, zugeschnitten, kommentar } = req.body;
    const sql = "UPDATE aufgaben SET hoehe = ?, breite = ?, laenge = ?, kammer = ?, kapplaenge = ?, lagenbreite = ?, lagenhoehe = ?, stueck = ?, reihenfolge = ?, seitenware = ?, ewd_programm = ?, stueck_pack = ?, zugeschnitten = ?, kommentar = ? WHERE ID = ?";
    const id = req.params.ID;
    const values = [hoehe, breite, laenge, kammer, kapplaenge, lagenbreite, lagenhoehe, stueck, reihenfolge, seitenware, ewd_programm, stueck_pack, zugeschnitten, kommentar, id];
    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: "Error updating entry" });
        return res.json({ message: "Entry updated successfully" });
    });
});

app.put('/aufgaben/updateReihenfolge/:ID', (req, res) => {
    const { reihenfolge } = req.body;
    const sql = "UPDATE aufgaben SET reihenfolge = ? WHERE ID = ?";
    const id = req.params.ID;
    const values = [reihenfolge, id];
    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: "Error updating entry" });
        return res.json({ message: "Entry updated successfully" });
    });
});

app.put('/aufgaben/updateAbgeschlossen/:ID', (req, res) => {
    const { ist_stueck, status } = req.body;
    const sql = "UPDATE aufgaben SET ist_stueck = ?, status = ? WHERE ID = ?";
    const id = req.params.ID;
    const values = [ist_stueck, status, id];
    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: "Error updating entry" });
        return res.json({ message: "Entry updated successfully" });
    });
});

// Auftrag löschen
app.delete('/auftraege/delete/:ID', (req, res) => {
    const id = req.params.ID;
    const sql = "DELETE FROM auftraege WHERE ID = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Error deleting entry" });
        return res.json({ message: "Entry deleted successfully" });
    });
});

// Aufgabe löschen
app.delete('/aufgaben/delete/:ID', (req, res) => {
    const id = req.params.ID;
    const sql = "DELETE FROM aufgaben WHERE ID = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Error deleting entry" });
        return res.json({ message: "Entry deleted successfully" });
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).send("Name is required.");
    }
    const query = "INSERT INTO users (name, isLoggedIn) VALUES (?, 1) ON DUPLICATE KEY UPDATE isLoggedIn = 1";
    db.query(query, [name], (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json({ name });
    });
});

// Logout endpoint
app.post('/logout', (req, res) => {
    const { name } = req.body;
    const query = "UPDATE users SET isLoggedIn = FALSE, lastOnline = NOW() WHERE name = ?";
    db.query(query, [name], (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.send("Logged out successfully.");
    });
});


// Get online users
app.get('/online-users', (req, res) => {
    const query = "SELECT * FROM users";
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.json(results);
    });
});

app.listen(8081, () => {
    console.log("Server listening on port 8081");
});
