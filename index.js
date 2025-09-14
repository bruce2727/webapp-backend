const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // puoi limitare a un dominio in seguito
app.use(express.json());

// Rotta di test
app.get("/", (req, res) => {
  res.send("Backend attivo!");
});

// Rotta per salvare i dati
app.post("/save", (req, res) => {
  const dati = req.body;

  fs.appendFile("dati.json", JSON.stringify(dati) + "\n", (err) => {
    if (err) {
      console.error("Errore nel salvataggio:", err);
      return res.status(500).json({ message: "Errore nel salvataggio" });
    }
    res.status(200).json({ message: "Dati salvati!" });
  });
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server attivo su http://localhost:${PORT}`);
});
