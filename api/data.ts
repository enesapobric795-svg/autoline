import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

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

const initialKey = "autoline_parts_initialized";
const localStorePath = () => path.resolve(process.cwd(), "server", "parts.json");

const ensureLocalData = () => {
  const filePath = localStorePath();
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
  }
  return filePath;
};

const hasSupabase = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_KEY;
let supabase: ReturnType<typeof createClient> | null = null;
if (hasSupabase) {
  supabase = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_KEY as string);
}

export const readParts = async (): Promise<Part[]> => {
  if (supabase) {
    const { data, error } = await supabase.from<Part>("parts").select("*").order("id", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) {
      // initialize table
      await supabase.from("parts").insert(initialData).select();
      return initialData;
    }
    return data as Part[];
  }

  const filePath = ensureLocalData();
  const payload = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(payload) as Part[];
};

export const writeParts = async (parts: Part[]) => {
  if (supabase) {
    // fetch existing ids
    const { data: existing } = await supabase.from<Part>("parts").select("id");
    const existingIds = (existing || []).map((r: any) => r.id);
    const newIds = parts.map((p) => p.id);
    const toDelete = existingIds.filter((id: number) => !newIds.includes(id));
    if (toDelete.length > 0) {
      await supabase.from("parts").delete().in("id", toDelete);
    }
    // upsert all parts
    await supabase.from("parts").upsert(parts);
    return;
  }

  const filePath = ensureLocalData();
  fs.writeFileSync(filePath, JSON.stringify(parts, null, 2));
};

export const createPart = async (body: Partial<Part>): Promise<Part> => {
  const newPart: Part = {
    id: Date.now(),
    name: String(body.name || ""),
    vehicleBrand: String(body.vehicleBrand || ""),
    catalogNumber: String(body.catalogNumber || ""),
    qty: Number(body.qty || 0),
    price: Number(body.price || 0),
    location: String(body.location || ""),
    onPik: Boolean(body.onPik),
    image: String(body.image || ""),
  };

  if (supabase) {
    const { data, error } = await supabase.from("parts").insert(newPart).select();
    if (error) throw error;
    return data[0] as Part;
  }

  const parts = await readParts();
  const updated = [...parts, newPart];
  fs.writeFileSync(ensureLocalData(), JSON.stringify(updated, null, 2));
  return newPart;
};

export const updatePart = async (id: number, body: Partial<Part>) => {
  if (supabase) {
    const { data, error } = await supabase.from("parts").update(body).eq("id", id).select();
    if (error) throw error;
    return data[0] as Part;
  }

  const parts = await readParts();
  const updated = parts.map((p) => (p.id === id ? { ...p, ...body } : p));
  fs.writeFileSync(ensureLocalData(), JSON.stringify(updated, null, 2));
  return updated.find((p) => p.id === id);
};

export const deletePart = async (id: number) => {
  if (supabase) {
    const { error } = await supabase.from("parts").delete().eq("id", id);
    if (error) throw error;
    return;
  }

  const parts = await readParts();
  const updated = parts.filter((p) => p.id !== id);
  fs.writeFileSync(ensureLocalData(), JSON.stringify(updated, null, 2));
};