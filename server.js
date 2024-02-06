const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express()
app.use(cors())

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ilk_volgger"
})

app.get('/', (re, res) => {
    return res.json("From Backend sied");
})

app.get('/auftraege', (req, res) => {
    const sql = "SELECT * FROM auftraege";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.post('/auftraege', (req, res) => {
    const { auftragName, lieferdatum } = req.body; // Annahme, dass die Daten über das Request-Body übermittelt werden
    const sql = "INSERT INTO auftraege (auftrag_name, auftrag_lieferdatum) VALUES (?, ?)";
    db.query(sql, [auftragName, lieferdatum], (err, result) => {
        if (err) return res.json(err);
        return res.json({ message: "Auftrag erfolgreich hinzugefügt", auftragId: result.insertId });
    });
});


app.listen(8081, () => {
    console.log('listening');
})