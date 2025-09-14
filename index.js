const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// GET dati
app.get("/load", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT data FROM archive_data ORDER BY id DESC LIMIT 1"
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0].data);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error("Errore caricamento dati:", err);
    res.status(500).json({ error: "Errore caricamento dati" });
  }
});

// POST dati
app.post("/save", async (req, res) => {
  const newData = req.body;
  try {
    await pool.query("INSERT INTO archive_data (data) VALUES ($1)", [newData]);
    res.json({ message: "Dati salvati su Supabase con successo" });
  } catch (err) {
    console.error("Errore salvataggio dati:", err);
    res.status(500).json({ error: "Errore salvataggio dati" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend attivo su http://localhost:${PORT}`);
});
