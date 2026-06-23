import fs from "fs";
import os from "os";
import path from "path";
import { kv } from "@vercel/kv";

export type Part = {
  id: number;
  name: string;
  vehicleBrand: string;
  catalogNumber: string;
  qty: number;
  price: number;
  location: string;
  onPik: boolean;
  image?: string;
};

const initialData: Part[] = [
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

const dataKey = "autoline-parts";

const localStorePath = () => {
  return path.resolve(process.cwd(), "server", "parts.json");
};

const ensureLocalData = () => {
  const filePath = localStorePath();
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
  }
  return filePath;
};

export const readParts = async () => {
  if (process.env.VERCEL) {
    const cached = await kv.get<Part[]>(dataKey);
    if (!cached || !Array.isArray(cached) || cached.length === 0) {
      await kv.set(dataKey, initialData);
      return initialData;
    }
    return cached;
  }

  const filePath = ensureLocalData();
  const payload = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(payload) as Part[];
};

export const writeParts = async (parts: Part[]) => {
  if (process.env.VERCEL) {
    await kv.set(dataKey, parts);
    return;
  }

  const filePath = ensureLocalData();
  fs.writeFileSync(filePath, JSON.stringify(parts, null, 2));
};

export const createPart = (body: Partial<Part>) => {
  return {
    id: Date.now(),
    name: String(body.name || ""),
    vehicleBrand: String(body.vehicleBrand || ""),
    catalogNumber: String(body.catalogNumber || ""),
    qty: Number(body.qty || 0),
    price: Number(body.price || 0),
    location: String(body.location || ""),
    onPik: Boolean(body.onPik),
    image: String(body.image || ""),
  } as Part;
};