const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "dati.json");

// Middleware
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// --- Rotta per caricare i dati ---
app.get("/load", (req, res) => {
  if (!fs.existsSync(DATA_FILE)) {
    return res.json([]); // se il file non esiste, restituisce array vuoto
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const json = JSON.parse(raw);
    res.json(json);
  } catch (err) {
    console.error("Errore lettura dati:", err);
    res.status(500).json({ error: "Errore nel caricamento dati" });
  }
});

// --- Rotta per salvare i dati ---
app.post("/save", (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
    res.json({ message: "Dati salvati con successo" });
  } catch (err) {
    console.error("Errore salvataggio dati:", err);
    res.status(500).json({ error: "Errore nel salvataggio dati" });
  }
});

// --- Avvio server ---
app.listen(PORT, () => {
  console.log(`✅ Backend attivo su http://localhost:${PORT}`);
});
