const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Connessione al database Supabase/Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// GET: carica i dati
app.get("/load", async (req, res) => {
  try {
    const result = await pool.query("SELECT content FROM archive_data LIMIT 1");
    if (result.rows.length > 0) {
      res.json(result.rows[0].content);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error("Errore caricamento dati:", err);
    res.status(500).json({ error: "Errore nel caricamento" });
  }
});

// POST: salva i dati
app.post("/save", async (req, res) => {
  const content = req.body;
  try {
    // manteniamo sempre un solo record
    await pool.query("DELETE FROM archive_data");
    await pool.query("INSERT INTO archive_data (content) VALUES ($1)", [content]);

    res.json({ message: "✅ Dati salvati correttamente" });
  } catch (err) {
    console.error("Errore salvataggio dati:", err);
    res.status(500).json({ error: "Errore nel salvataggio" });
  }
});

// (Opzionale) login centralizzato lato backend
app.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend attivo su http://localhost:${PORT}`);
});




