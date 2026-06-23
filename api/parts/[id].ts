import { readParts, writeParts } from "../data";

export default async function handler(req: any, res: any) {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });

    const parts = await readParts();
    const partIndex = parts.findIndex((part) => part.id === id);
    if (partIndex === -1) return res.status(404).json({ error: "Part not found" });

    if (req.method === "PUT") {
      const updatedPart = {
        ...parts[partIndex],
        ...req.body,
        qty: Number(req.body.qty),
        price: Number(req.body.price),
      };
      parts[partIndex] = updatedPart;
      await writeParts(parts);
      return res.status(200).json(updatedPart);
    }

    if (req.method === "DELETE") {
      const updated = parts.filter((part) => part.id !== id);
      await writeParts(updated);
      return res.status(204).end();
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}