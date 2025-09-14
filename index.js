const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

// Variabili d'ambiente (su Render le hai già impostate)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Crea client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// --- ENDPOINTS ---

// Carica i dati
app.get("/load", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("archive_data")
      .select("content")
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows found

    res.json(data ? data.content : []);
  } catch (err) {
    console.error("Errore /load:", err);
    res.status(500).json({ error: "Errore caricamento dati" });
  }
});

// Salva i dati
app.post("/save", async (req, res) => {
  try {
    const content = req.body;

    // elimina la riga esistente e inserisci quella nuova
    await supabase.from("archive_data").delete().neq("id", 0);

    const { error } = await supabase
      .from("archive_data")
      .insert([{ content }]);

    if (error) throw error;

    res.json({ message: "Dati salvati con successo" });
  } catch (err) {
    console.error("Errore /save:", err);
    res.status(500).json({ error: "Errore salvataggio dati" });
  }
});

// Avvio server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Backend attivo su http://localhost:${PORT}`);
});
