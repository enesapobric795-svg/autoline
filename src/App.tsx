import { useState } from "react";

type Part = {
  id: number;
  name: string;
  sku: string;
  catalogNumber: string;
  qty: number;
  price: number;
  location: string;
  onPik: boolean;
  image?: string;
};

export default function App() {
  const [parts, setParts] = useState<Part[]>([
    {
      id: 1,
      name: "Brake Pads",
      sku: "BP-100",
      catalogNumber: "BP-2024-001",
      qty: 5,
      price: 40,
      location: "A1",
      onPik: true,
    },
    {
      id: 2,
      name: "Oil Filter",
      sku: "OF-200",
      catalogNumber: "OF-2024-002",
      qty: 12,
      price: 10,
      location: "B2",
      onPik: false,
    },
  ]);

  const [search, setSearch] = useState("");
  const [olxConnected, setOlxConnected] = useState(false);

  // FORM STATE (SVE STRING OSIM checkbox)
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [catalogNumber, setCatalogNumber] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [onPik, setOnPik] = useState(false);
  const [image, setImage] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const connectOlx = () => {
    // Placeholder: replace with real OLX auth flow / backend call
    console.log("Connect to OLX button clicked");
    setOlxConnected(true);
  };

  const clearForm = () => {
    setName("");
    setSku("");
    setCatalogNumber("");
    setQty("");
    setPrice("");
    setLocation("");
    setOnPik(false);
    setImage("");
    setEditingId(null);
  };

  const addPart = () => {
    if (!name || !sku || !catalogNumber || !qty || !price) return;

    const newPart: Part = {
      id: Date.now(),
      name,
      sku,
      catalogNumber,
      qty: Number(qty),
      price: Number(price),
      location,
      onPik,
      image,
    };

    setParts((prev) => [...prev, newPart]);
    clearForm();
  };

  const savePart = () => {
    if (editingId === null || !name || !sku || !catalogNumber || !qty || !price) return;

    setParts((prev) =>
      prev.map((part) =>
        part.id === editingId
          ? {
              ...part,
              name,
              sku,
              catalogNumber,
              qty: Number(qty),
              price: Number(price),
              location,
              onPik,
              image,
            }
          : part
      )
    );

    clearForm();
  };

  const startEdit = (part: Part) => {
    setEditingId(part.id);
    setName(part.name);
    setSku(part.sku);
    setCatalogNumber(part.catalogNumber);
    setQty(String(part.qty));
    setPrice(String(part.price));
    setLocation(part.location);
    setOnPik(part.onPik);
    setImage(part.image || "");
  };

  const filteredParts = parts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.catalogNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <div style={{ marginBottom: "20px", borderBottom: "2px solid #333", paddingBottom: "15px" }}>
        <h1 style={{ margin: "0 0 5px 0", fontSize: "24px" }}>Autoline d.o.o., Šije</h1>
        <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>Auto Parts Inventory Management</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <button
          onClick={connectOlx}
          style={{
            padding: "10px 18px",
            background: olxConnected ? "#22c55e" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {olxConnected ? "OLX Connected" : "Connect to OLX"}
        </button>
        {olxConnected && <span style={{ color: "#16a34a", fontWeight: 600 }}>Connected</span>}
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search parts by name, SKU, or catalog number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", marginBottom: "15px", width: "100%", maxWidth: "400px" }}
      />

      {/* FORM */}
      <div style={{ marginBottom: "20px" }}>
        <h3>{editingId ? "Edit part" : "Add new part"}</h3>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "10px" }}
        />
        <input
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "10px" }}
        />
        <input
          placeholder="Catalog Number"
          value={catalogNumber}
          onChange={(e) => setCatalogNumber(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "10px" }}
        />
        <input
          placeholder="Qty"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "10px" }}
        />
        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "10px" }}
        />
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "10px" }}
        />

        <label style={{ display: "block", marginBottom: "10px" }}>
          <input
            type="checkbox"
            checked={onPik}
            onChange={(e) => setOnPik(e.target.checked)}
            style={{ marginRight: "8px" }}
          />
          On PIK
        </label>

        <label style={{ display: "block", marginBottom: "10px" }}>
          Image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  setImage(event.target?.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
            style={{ display: "block", marginTop: "5px", width: "100%" }}
          />
        </label>
        {image && (
          <div style={{ marginBottom: "10px" }}>
            <img
              src={image}
              alt="Preview"
              style={{ maxWidth: "150px", maxHeight: "150px", borderRadius: "5px" }}
            />
          </div>
        )}

        <button onClick={editingId ? savePart : addPart} style={{ marginRight: "10px" }}>
          {editingId ? "Save" : "Add"}
        </button>
        {editingId && (
          <button onClick={clearForm} style={{ background: "#e5e7eb", color: "#111" }}>
            Cancel
          </button>
        )}
      </div>

      {/* CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "15px",
        marginBottom: "30px"
      }}>
        {filteredParts.map(part => (
          <div key={part.id} style={{
            background: "white",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            {part.image && (
              <img
                src={part.image}
                alt={part.name}
                style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px" }}
              />
            )}
            <h3>{part.name}</h3>
            <p>SKU: {part.sku}</p>
            <p>Catalog #: {part.catalogNumber}</p>
            <p>Location: {part.location}</p>
            <p>Qty: <b style={{ color: part.qty < 3 ? "red" : "black" }}>{part.qty}</b></p>
            <p>Price: {part.price} €</p>
            <p>PIK: {part.onPik ? "YES" : "NO"}</p>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button onClick={() => startEdit(part)}>Edit</button>
              <button
                onClick={() =>
                  setParts((prev) => prev.filter((p) => p.id !== part.id))
                }
                style={{ background: "#f87171", color: "white" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}