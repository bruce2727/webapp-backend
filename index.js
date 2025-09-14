// index.js
const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
app.use(bodyParser.json());

// Connessione al database PostgreSQL (Render → Environment Variables)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test connessione
pool.connect()
  .then(() => console.log("✅ Connessione al database riuscita"))
  .catch(err => console.error("❌ Errore connessione DB:", err));

// Endpoint per caricare i dati
app.get("/load", async (req, res) => {
  try {
    const result = await pool.query("SELECT data FROM archive_data ORDER BY id DESC LIMIT 1");
    if (result.rows.length > 0) {
      res.json(result.rows[0].data);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error("Errore caricamento:", err);
    res.status(500).json({ error: "Errore nel caricamento dati" });
  }
});

// Endpoint per salvare i dati
app.post("/save", async (req, res) => {
  try {
    const jsonData = req.body;
    await pool.query("INSERT INTO archive_data (data) VALUES ($1)", [jsonData]);
    res.json({ message: "Dati salvati con successo" });
  } catch (err) {
    console.error("Errore salvataggio:", err);
    res.status(500).json({ error: "Errore nel salvataggio dati" });
  }
});

// Avvio server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Backend attivo su http://localhost:${PORT}`);
});
