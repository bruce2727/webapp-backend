const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connessione a Postgres (Supabase)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Endpoint di test
app.get("/", (req, res) => {
  res.send("✅ Backend attivo!");
});

// Salvataggio dati
app.post("/save", async (req, res) => {
  try {
    const payload = req.body;
    if (!payload) {
      return res.status(400).json({ error: "Nessun dato ricevuto" });
    }

    await pool.query(
      "INSERT INTO archive_data (data, created_at) VALUES ($1, NOW())",
      [JSON.stringify(payload)]
    );

    res.json({ message: "✅ Dati salvati con successo" });
  } catch (err) {
    console.error("Errore in /save:", err);
    res.status(500).json({ error: "Errore salvataggio" });
  }
});

// Caricamento dati
app.get("/load", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT data FROM archive_data ORDER BY created_at DESC LIMIT 1"
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0].data);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error("Errore in /load:", err);
    res.status(500).json({ error: "Errore caricamento" });
  }
});

// Avvio server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Backend attivo su http://localhost:${PORT}`);
});
