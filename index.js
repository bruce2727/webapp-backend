// index.js
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

// Leggi variabili da Render (già impostate nel dashboard)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERRORE: SUPABASE_URL o SUPABASE_KEY non sono definite.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// === ENDPOINT: Carica dati ===
app.get("/load", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("archive_data")
      .select("data")
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Errore load:", error);
      return res.status(500).json({ error: "Errore caricamento dati" });
    }

    res.json(data ? data.data : []); // se non ci sono righe, restituisci []
  } catch (err) {
    console.error("Errore /load:", err);
    res.status(500).json({ error: "Errore interno server" });
  }
});

// === ENDPOINT: Salva dati ===
app.post("/save", async (req, res) => {
  const payload = req.body;

  try {
    // Sovrascrivi sempre l'unica riga della tabella
    const { error } = await supabase
      .from("archive_data")
      .upsert({ id: 1, data: payload });

    if (error) {
      console.error("Errore save:", error);
      return res.status(500).json({ error: "Errore salvataggio dati" });
    }

    res.json({ message: "Dati salvati con successo" });
  } catch (err) {
    console.error("Errore /save:", err);
    res.status(500).json({ error: "Errore interno server" });
  }
});

// === AVVIO SERVER ===
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Backend attivo su http://localhost:${PORT}`);
});
