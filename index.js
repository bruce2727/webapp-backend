const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Variabili da Render
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// Connessione a Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 📥 Carica i dati da Supabase
app.get("/load", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("archive_data")
      .select("content")
      .single();

    if (error) throw error;

    res.json(data ? data.content : []);
  } catch (err) {
    console.error("Errore nel caricamento:", err.message);
    res.json([]);
  }
});

// 📤 Salva i dati su Supabase
app.post("/save", async (req, res) => {
  try {
    const payload = req.body;

    // Sovrascrive il contenuto (manteniamo una sola riga nella tabella)
    const { error } = await supabase
      .from("archive_data")
      .upsert({ id: 1, content: payload });

    if (error) throw error;

    res.json({ message: "Dati salvati con successo" });
  } catch (err) {
    console.error("Errore nel salvataggio:", err.message);
    res.status(500).json({ message: "Errore nel salvataggio" });
  }
});

// Avvio server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Backend attivo su http://localhost:${PORT}`);
});
