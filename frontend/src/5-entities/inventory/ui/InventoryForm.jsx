import { useState, useEffect } from "react";

export default function InventoryForm({ initialData = null, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    category: "",
    supplier: "",
    location: "",
    sku: "", // ✅ SKU (alleen bij bewerken)
    barcode: "", // ✅ Barcode (alleen bij bewerken)
  });

  const [errors, setErrors] = useState({});

  // ✅ Vul het formulier als we bewerken
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        quantity: initialData.quantity || "",
        category: initialData.category || "",
        supplier: initialData.supplier || "",
        location: initialData.location || "",
        sku: initialData.sku || "",
        barcode: initialData.barcode || "",
      });
    }
  }, [initialData]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // ✅ Validatie
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Naam is verplicht";
    if (!formData.quantity.trim()) newErrors.quantity = "Aantal is verplicht";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 🚀 Verstuur de gegevens
    onSave(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-gray-700">Naam *</span>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </label>

      <label className="block">
        <span className="text-gray-700">Beschrijving</span>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
        ></textarea>
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-gray-700">Voorraad *</span>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
        </label>

        <label className="block">
          <span className="text-gray-700">Categorie</span>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-gray-700">Leverancier</span>
        <input
          type="text"
          name="supplier"
          value={formData.supplier}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </label>

      <label className="block">
        <span className="text-gray-700">Locatie</span>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </label>

      {/* ✅ Alleen tonen als we bewerken */}
      {initialData && (
        <>
          <label className="block">
            <span className="text-gray-700">SKU</span>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              disabled
              className="w-full px-3 py-2 border rounded-lg bg-gray-200 cursor-not-allowed"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Barcode</span>
            <input
              type="text"
              name="barcode"
              value={formData.barcode}
              disabled
              className="w-full px-3 py-2 border rounded-lg bg-gray-200 cursor-not-allowed"
            />
          </label>
        </>
      )}

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
        >
          Annuleren
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Opslaan
        </button>
      </div>
    </form>
  );
}