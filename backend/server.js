const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
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

// Auftrag hinzufügen
app.post('/auftraege/create', (req, res) => {
    const { auftrag_name, auftrag_liefertermin } = req.body;
    const sql = "INSERT INTO auftraege (auftrag_name, auftrag_liefertermin) VALUES (?, ?)";
    db.query(sql, [auftrag_name, auftrag_liefertermin], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Auftrag erfolgreich hinzugefügt", ID: result.insertId });
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

// Auftrag löschen
app.delete('/auftraege/delete/:ID', (req, res) => {
    const id = req.params.ID;
    const sql = "DELETE FROM auftraege WHERE ID = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Error deleting entry" });
        return res.json({ message: "Entry deleted successfully" });
    });
});

app.listen(8081, () => {
    console.log("Server listening on port 8081");
});
