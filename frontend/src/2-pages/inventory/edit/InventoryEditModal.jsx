import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

export default function InventoryEditModal() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ ID uit de URL halen
  const [item, setItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    quantity: "",
    category: "",
    supplier: "",
    location: "",
  });

  useEffect(() => {
    async function fetchItem() {
      try {
        const response = await fetch(
          `http://145.24.222.50:8000/inventory/${id}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Kan item niet ophalen");

        const data = await response.json();
        setItem(data);
        setFormData({
          name: data.name || "",
          description: data.description || "",
          sku: data.sku || "",
          quantity: data.quantity || "",
          category: data.category || "",
          supplier: data.supplier || "",
          location: data.location || "",
        });
      } catch (error) {
        console.error("Fout bij ophalen van item:", error);
      }
    }

    fetchItem();
  }, [id]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    try {
      const response = await fetch(
        `http://145.24.222.50:8000/inventory/${id}`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Kan item niet updaten");

      navigate("/dashboard"); // ✅ Terug naar dashboard na opslaan
    } catch (error) {
      console.error("Fout bij updaten van item:", error);
    }
  }

  if (!item) return null;

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
          Item Bewerken
        </h2>

        <form className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Naam</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
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
              <span className="text-gray-700">SKU</span>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Voorraad</span>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </label>
          </div>

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
