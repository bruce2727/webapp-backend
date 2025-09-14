import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// GET dati
app.get("/load", async (req, res) => {
  try {
    const result = await pool.query("SELECT data FROM archive_data LIMIT 1");
    if (result.rows.length === 0) {
      return res.json([]);
    }
    res.json(result.rows[0].data);
  } catch (err) {
    console.error("Errore /load:", err);
    res.status(500).json({ error: "Errore caricamento dati" });
  }
});

// POST salvataggio
app.post("/save", async (req, res) => {
  try {
    const newData = req.body;
    await pool.query(`
      INSERT INTO archive_data (id, data)
      VALUES (1, $1)
      ON CONFLICT (id)
      DO UPDATE SET data = $1;
    `, [newData]);
    res.json({ message: "Dati salvati con successo" });
  } catch (err) {
    console.error("Errore /save:", err);
    res.status(500).json({ error: "Errore salvataggio dati" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Backend attivo su http://localhost:${PORT}`);
});
