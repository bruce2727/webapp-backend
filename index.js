const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connessione a Supabase Postgres tramite variabile di ambiente
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Endpoint per caricare i dati (recupera l'ultima riga salvata)
app.get("/load", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT data FROM archive_data ORDER BY created_at DESC LIMIT 1"
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0].data);
    } else {
      res.json([]); // nessun dato ancora salvato
    }
  } catch (err) {
    console.error("Errore caricamento dati:", err);
    res.status(500).json({ error: "Errore nel caricamento dei dati" });
  }
});

// Endpoint per salvare i dati (inserisce una nuova riga)
app.post("/save", async (req, res) => {
  try {
    const newData = req.body;
    await pool.query("INSERT INTO archive_data (data) VALUES ($1)", [
      newData
    ]);
    res.json({ message: "Dati salvati con successo" });
  } catch (err) {
    console.error("Errore salvataggio dati:", err);
    res.status(500).json({ error: "Errore nel salvataggio dei dati" });
  }
});

// Avvio server
app.listen(PORT, () => {
  console.log(`✅ Backend attivo su http://localhost:${PORT}`);
});





