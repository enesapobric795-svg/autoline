import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const port = 4174;
const dataFile = path.resolve(process.cwd(), "server", "parts.json");

app.use(cors());
app.use(express.json());

const ensureDataFile = () => {
  if (!fs.existsSync(dataFile)) {
    const initialData = [
      {
        id: 1,
        name: "Kočione pločice",
        vehicleBrand: "BMW",
        catalogNumber: "BP-2024-001",
        qty: 5,
        price: 40,
        location: "A1",
        onPik: true,
      },
      {
        id: 2,
        name: "Filter ulja",
        vehicleBrand: "Mercedes",
        catalogNumber: "OF-2024-002",
        qty: 12,
        price: 10,
        location: "B2",
        onPik: false,
      },
    ];
    fs.writeFileSync(dataFile, JSON.stringify(initialData, null, 2));
  }
};

const readParts = () => {
  ensureDataFile();
  const file = fs.readFileSync(dataFile, "utf-8");
  return JSON.parse(file);
};

const writeParts = (parts) => {
  fs.writeFileSync(dataFile, JSON.stringify(parts, null, 2));
};

app.get("/api/parts", (req, res) => {
  try {
    res.json(readParts());
  } catch (error) {
    res.status(500).json({ error: "Unable to read parts" });
  }
});

app.post("/api/parts", (req, res) => {
  try {
    const parts = readParts();
    const newPart = {
      id: Date.now(),
      ...req.body,
      qty: Number(req.body.qty),
      price: Number(req.body.price),
    };
    const updated = [...parts, newPart];
    writeParts(updated);
    res.status(201).json(newPart);
  } catch (error) {
    res.status(500).json({ error: "Unable to add part" });
  }
});

app.put("/api/parts/:id", (req, res) => {
  try {
    const parts = readParts();
    const id = Number(req.params.id);
    const updated = parts.map((part) =>
      part.id === id
        ? { ...part, ...req.body, qty: Number(req.body.qty), price: Number(req.body.price) }
        : part
    );
    writeParts(updated);
    const updatedPart = updated.find((part) => part.id === id);
    if (!updatedPart) return res.status(404).json({ error: "Part not found" });
    res.json(updatedPart);
  } catch (error) {
    res.status(500).json({ error: "Unable to update part" });
  }
});

app.delete("/api/parts/:id", (req, res) => {
  try {
    const parts = readParts();
    const id = Number(req.params.id);
    const updated = parts.filter((part) => part.id !== id);
    writeParts(updated);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Unable to delete part" });
  }
});

app.listen(port, () => {
  console.log(`API running at http://127.0.0.1:${port}`);
});