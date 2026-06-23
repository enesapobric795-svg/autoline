import { createPart, readParts, writeParts } from "./data";

export default async function handler(req: any, res: any) {
  try {
    if (req.method === "GET") {
      const parts = await readParts();
      return res.status(200).json(parts);
    }

    if (req.method === "POST") {
      const part = createPart(req.body);
      const parts = await readParts();
      const updated = [...parts, part];
      await writeParts(updated);
      return res.status(201).json(part);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}