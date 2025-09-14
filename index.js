const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000; // Render usa una porta dinamica

const DATA_FILE = path.join(__dirname, "dati.json");

app.use(cors());
app.use(express.json());

// --- Endpoint per caricare i dati ---
app.get("/load", (req, res) => {
  if (!fs.existsSync(DATA_FILE)) {
    return res.json([]); // se il file non esiste restituisce array vuoto
  }
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("Errore lettura dati.json:", err);
      return res.status(500).json({ error: "Errore lettura dati" });
    }
    try {
      res.json(JSON.parse(data));
    } catch (e) {
      console.error("Errore parsing JSON:", e);
      res.json([]); // se il file è corrotto, restituisce array vuoto
    }
  });
});

// --- Endpoint per salvare i dati ---
app.post("/save", (req, res) => {
  const body = req.body;
  fs.writeFile(DATA_FILE, JSON.stringify(body, null, 2), (err) => {
    if (err) {
      console.error("Errore scrittura dati.json:", err);
      return res.status(500).json({ error: "Errore salvataggio dati" });
    }
    res.json({ message: "Dati salvati con successo" });
  });
});

// --- Endpoint per login admin ---
app.post("/login", (req, res) => {
  const { password } = req.body;

  // Puoi cambiare la password qui 👇
  const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";

  if (password === ADMIN_PASS) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "Password errata" });
  }
});

// --- Avvio server ---
app.listen(PORT, () => {
  console.log(`✅ Backend attivo su http://localhost:${PORT}`);
});


