import { readParts, writeParts, updatePart, deletePart } from "../data";

export default async function handler(req: any, res: any) {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });

    const parts = await readParts();
    const partIndex = parts.findIndex((part) => part.id === id);
    if (partIndex === -1) return res.status(404).json({ error: "Part not found" });

    if (req.method === "PUT") {
      const updated = await updatePart(id, req.body);
      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      await deletePart(id);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}