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
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <h1 className="brand-name">🚗 Autoline d.o.o.</h1>
            <p className="brand-subtitle">Auto Parts Inventory Management</p>
          </div>
          <button
            className={`btn-olx ${olxConnected ? "connected" : ""}`}
            onClick={connectOlx}
          >
            {olxConnected ? "✓ OLX Connected" : "Connect to OLX"}
          </button>
        </div>
      </header>

      <main className="app-main">
        {/* SEARCH SECTION */}
        <section className="search-section">
          <input
            className="search-input"
            placeholder="🔍 Search by name, SKU, or catalog number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </section>

        {/* FORM SECTION */}
        <section className="form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>{editingId ? "✏️ Edit Part" : "➕ Add New Part"}</h2>
              <p>Manage your auto parts inventory</p>
            </div>

            <div className="form-grid">
              <input
                className="form-input"
                placeholder="Part Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="form-input"
                placeholder="SKU"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
              <input
                className="form-input"
                placeholder="Catalog Number"
                value={catalogNumber}
                onChange={(e) => setCatalogNumber(e.target.value)}
              />
              <input
                className="form-input"
                type="number"
                placeholder="Quantity"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
              <input
                className="form-input"
                type="number"
                placeholder="Price (€)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <input
                className="form-input"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={onPik}
                  onChange={(e) => setOnPik(e.target.checked)}
                />
                <span>Available for PIK</span>
              </label>

              <label className="file-label">
                📷 Upload Image
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
                />
              </label>
            </div>

            {image && (
              <div className="image-preview">
                <img src={image} alt="Preview" />
              </div>
            )}

            <div className="form-actions">
              <button
                className="btn btn-primary"
                onClick={editingId ? savePart : addPart}
              >
                {editingId ? "Save Changes" : "Add Part"}
              </button>
              {editingId && (
                <button
                  className="btn btn-secondary"
                  onClick={clearForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </section>

        {/* INVENTORY SECTION */}
        <section className="inventory-section">
          <div className="section-header">
            <h2>📦 Inventory ({filteredParts.length})</h2>
            <p>Manage and track your auto parts</p>
          </div>

          {filteredParts.length === 0 ? (
            <div className="empty-state">
              <p>No parts found. Add your first part to get started!</p>
            </div>
          ) : (
            <div className="product-grid">
              {filteredParts.map(part => (
                <div key={part.id} className="product-card">
                  {part.image && (
                    <div className="product-image">
                      <img src={part.image} alt={part.name} />
                    </div>
                  )}
                  <div className="product-content">
                    <div className="product-header">
                      <h3 className="product-name">{part.name}</h3>
                      <span className={`stock-badge ${part.qty < 3 ? "low-stock" : "in-stock"}`}>
                        {part.qty} in stock
                      </span>
                    </div>
                    <div className="product-details">
                      <div className="detail-row">
                        <span className="label">SKU:</span>
                        <span className="value">{part.sku}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Catalog #:</span>
                        <span className="value">{part.catalogNumber}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Location:</span>
                        <span className="value">{part.location}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">PIK:</span>
                        <span className={`value ${part.onPik ? "pik-yes" : "pik-no"}`}>
                          {part.onPik ? "✓ YES" : "✗ NO"}
                        </span>
                      </div>
                    </div>
                    <div className="product-footer">
                      <div className="price-box">
                        <span className="price-label">Price</span>
                        <span className="price">{part.price} €</span>
                      </div>
                      <div className="button-group">
                        <button
                          className="btn btn-edit"
                          onClick={() => startEdit(part)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() =>
                            setParts((prev) => prev.filter((p) => p.id !== part.id))
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}