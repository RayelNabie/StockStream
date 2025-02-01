import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

export default function InventoryCreateModal() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    category: "",
    supplier: "",
    location: "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Naam is verplicht";
    if (!formData.quantity.trim()) newErrors.quantity = "Aantal is verplicht";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/inventory/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          quantity: String(formData.quantity),
        }),
      });

      if (!response.ok) throw new Error("Kan item niet toevoegen");

      const responseData = await response.json();
      const newId = responseData.item?.id; // ✅ Correcte ID ophalen

      if (!newId) throw new Error("Ontbrekende ID in API respons");
      if (!responseData.item || !responseData.item.id) {
        throw new Error("Geen geldige ID ontvangen van de server");
      }

      console.log(`Navigeren naar /dashboard/inventory/${newId}`);

      console.log("Nieuw item aangemaakt met ID:", responseData.item.id);

      navigate(`/dashboard/inventory/${responseData.item.id}`);
    } catch (error) {
      console.error("Fout bij toevoegen van item:", error);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center sm:justify-end transition-opacity duration-300">
      <div
        className="absolute inset-0 backdrop-blur-lg transition-opacity duration-500"
        onClick={() => navigate("/dashboard")}
      />

      <div className="fixed bg-white shadow-lg p-6 rounded-t-2xl sm:rounded-l-2xl w-[100%] sm:w-[40%] h-[90vh] sm:h-screen bottom-0 sm:top-1/2 sm:right-0 sm:-translate-y-1/2 transition-transform duration-300 ease-in-out">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={() => navigate("/dashboard")}
        >
          <FaTimes size={24} />
        </button>

        <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
          Nieuw Product
        </h2>

        <form className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Naam*</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </label>

          <label className="block">
            <span className="text-gray-700">Voorraad (Aantal)*</span>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              min="1"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm">{errors.quantity}</p>
            )}
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

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
            >
              Annuleren
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Opslaan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
