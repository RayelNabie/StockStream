import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

export default function InventoryDetailModal() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ Haal ID uit de URL
  const [item, setItem] = useState(null);

  useEffect(() => {
    const controller = new AbortController(); // 🛑 AbortController om verzoek te annuleren bij unmount
    const signal = controller.signal;

    async function fetchItem() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/inventory/${id}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          signal, // ✅ AbortController toevoegen aan fetch-request
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setItem(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fout bij ophalen van item:", error);
        }
      }
    }

    fetchItem();

    return () => controller.abort(); // 🚀 Cleanup: verzoek annuleren bij unmount
  }, [id]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center sm:justify-end transition-opacity duration-300">
      {/* ✅ Klik buiten modal → Sluit de modal en ga terug naar /dashboard */}
      <div
        className="absolute inset-0 backdrop-blur-lg transition-opacity duration-500"
        onClick={() => navigate("/dashboard")}
      />

      <div
        className="fixed bg-white shadow-lg p-6 rounded-t-2xl sm:rounded-l-2xl
          w-[100%] sm:w-[40%] h-[90vh] sm:h-screen bottom-0 sm:top-1/2 sm:right-0 sm:-translate-y-1/2 transition-transform duration-300 ease-in-out"
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={() => navigate("/dashboard")}
        >
          <FaTimes size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4">{item.name}</h2>
        <p className="text-gray-600 mb-2">{item.description}</p>
        <p className="text-sm text-gray-500">SKU: {item.sku}</p>
        <p className="text-sm text-gray-500">Categorie: {item.category}</p>
        <p className="text-sm text-gray-500">Voorraad: {item.quantity}</p>
        <p className="text-sm text-gray-500">Locatie: {item.location}</p>
      </div>
    </div>
  );
}
