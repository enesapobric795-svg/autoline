import { useEffect, useState } from "react";

type Part = {
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

export default function App() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [olxConnected, setOlxConnected] = useState(false);

  const STORAGE_KEY = "autoline-parts";

  const loadParts = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setParts(JSON.parse(raw) as Part[]);
      } else {
        const initial: Part[] = [
          { id: 1, name: "Kočione pločice", vehicleBrand: "BMW", catalogNumber: "BP-2024-001", qty: 5, price: 40, location: "A1", onPik: true },
          { id: 2, name: "Filter ulja", vehicleBrand: "Mercedes", catalogNumber: "OF-2024-002", qty: 12, price: 10, location: "B2", onPik: false },
        ];
        setParts(initial);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      }
    } catch (err) {
      console.error(err);
      setError("Greška pri učitavanju lokalnih podataka.");
    }
  };

  useEffect(() => {
    loadParts();
  }, []);

  // FORM STATE (SVE STRING OSIM checkbox)
  const [name, setName] = useState("");
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [catalogNumber, setCatalogNumber] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [onPik, setOnPik] = useState(false);
  const [image, setImage] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const connectOlx = () => {
    // Privremeno: zamijeni pravim OLX autentifikacijskim tokom / backend pozivom
    console.log("Kliknuto dugme za povezivanje sa OLX");
    setOlxConnected(true);
  };

  const clearForm = () => {
    setName("");
    setVehicleBrand("");
    setCatalogNumber("");
    setQty("");
    setPrice("");
    setLocation("");
    setOnPik(false);
    setImage("");
    setEditingId(null);
  };

  const addPart = async () => {
    if (!name || !vehicleBrand || !catalogNumber || !qty || !price) return;

    setSaving(true);
    setError(null);
    try {
      const newPart: Part = {
        id: Date.now(),
        name,
        vehicleBrand,
        catalogNumber,
        qty: Number(qty),
        price: Number(price),
        location,
        onPik,
        image,
      };
      const updated = [...parts, newPart];
      setParts(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      clearForm();
    } catch (err) {
      console.error(err);
      setError("Greška pri spremanju lokalnog dijela.");
    } finally {
      setSaving(false);
    }
  };

  const savePart = async () => {
    if (editingId === null || !name || !vehicleBrand || !catalogNumber || !qty || !price) return;

    setSaving(true);
    setError(null);
    try {
      const updated = parts.map((p) => (p.id === editingId ? {
        ...p,
        name,
        vehicleBrand,
        catalogNumber,
        qty: Number(qty),
        price: Number(price),
        location,
        onPik,
        image,
      } : p));
      setParts(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      clearForm();
    } catch (err) {
      console.error(err);
      setError("Greška pri spremanju lokalne promjene.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (part: Part) => {
    setEditingId(part.id);
    setName(part.name);
    setVehicleBrand(part.vehicleBrand);
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
      p.vehicleBrand.toLowerCase().includes(search.toLowerCase()) ||
      p.catalogNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <img src="/viber_slika_2026-06-23_10-30-42-521.png" alt="Autoline Logo" className="brand-logo" />
            <h1 className="brand-name">🚗 Autoline d.o.o.</h1>
            <p className="brand-subtitle">Upravljanje zalihama auto dijelova</p>
          </div>
          <button
            className={`btn-olx ${olxConnected ? "connected" : ""}`}
            onClick={connectOlx}
          >
            {olxConnected ? "✓ OLX povezan" : "Poveži se s OLX"}
          </button>
        </div>
      </header>

      <main className="app-main">
        {/* SEARCH SECTION */}
        <section className="search-section">
          <input
            className="search-input"
            placeholder="🔍 Pretraži po nazivu, marki vozila ili katalogu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </section>

        {/* FORM SECTION */}
        <section className="form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>{editingId ? "✏️ Uredi dio" : "➕ Dodaj novi dio"}</h2>
              <p>Upravljaj zalihama auto dijelova</p>
              {!loading && (
                <div className="api-warning">
                  Aplikacija koristi lokalnu pohranu (localStorage). Podaci se ne dijele online.
                </div>
              )}
            </div>

            <div className="form-grid">
              <input
                className="form-input"
                placeholder="Naziv dijela"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="form-input"
                placeholder="Marka vozila"
                value={vehicleBrand}
                onChange={(e) => setVehicleBrand(e.target.value)}
              />
              <input
                className="form-input"
                placeholder="Kataloški broj"
                value={catalogNumber}
                onChange={(e) => setCatalogNumber(e.target.value)}
              />
              <input
                className="form-input"
                type="number"
                placeholder="Količina"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
              <input
                className="form-input"
                type="number"
                placeholder="Cijena (€)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <input
                className="form-input"
                placeholder="Lokacija"
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
                <span>Dostupno za PIK</span>
              </label>

              <label className="file-label">
                📷 Učitaj sliku
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
                <img src={image} alt="Pregled" />
              </div>
            )}

            <div className="form-actions">
              <button
                className="btn btn-primary"
                onClick={editingId ? savePart : addPart}
                disabled={saving}
              >
                {saving ? "Spremanje..." : editingId ? "Spremi promjene" : "Dodaj dio"}
              </button>
              {editingId && (
                <button
                  className="btn btn-secondary"
                  onClick={clearForm}
                  disabled={saving}
                >
                  Otkaži
                </button>
              )}
            </div>
          </div>
        </section>

        {/* INVENTORY SECTION */}
        <section className="inventory-section">
            <div className="section-header">
            <h2>📦 Zaliha ({filteredParts.length})</h2>
            <p>Upravljaj i prati auto dijelove</p>
          </div>

          {loading ? (
            <div className="empty-state">
              <p>Učitavanje zajedničke baze...</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <p>{error}</p>
              <button className="btn btn-primary" onClick={loadParts}>
                Pokušaj ponovno
              </button>
            </div>
          ) : filteredParts.length === 0 ? (
            <div className="empty-state">
              <p>Nema pronađenih dijelova. Dodaj prvi dio da počneš!</p>
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
                        {part.qty} na stanju
                      </span>
                    </div>
                    <div className="product-details">
                      <div className="detail-row">
                        <span className="label">Marka:</span>
                        <span className="value">{part.vehicleBrand}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Kataloški br.:</span>
                        <span className="value">{part.catalogNumber}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Lokacija:</span>
                        <span className="value">{part.location}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">PIK:</span>
                        <span className={`value ${part.onPik ? "pik-yes" : "pik-no"}`}>
                          {part.onPik ? "✓ DA" : "✗ NE"}
                        </span>
                      </div>
                    </div>
                    <div className="product-footer">
                      <div className="price-box">
                        <span className="price-label">Cijena</span>
                        <span className="price">{part.price} €</span>
                      </div>
                      <div className="button-group">
                        <button
                          className="btn btn-edit"
                          onClick={() => startEdit(part)}
                        >
                          Uredi
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => {
                            setSaving(true);
                            setError(null);
                            try {
                              const updated = parts.filter((p) => p.id !== part.id);
                              setParts(updated);
                              localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                            } catch (err) {
                              setError("Greška pri brisanju lokalnog dijela.");
                              console.error(err);
                            } finally {
                              setSaving(false);
                            }
                          }}
                        >
                          Obriši
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