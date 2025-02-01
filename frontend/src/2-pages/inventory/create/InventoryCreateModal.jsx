import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import InventoryForm from "../../../5-entities/inventory/ui/InventoryForm.jsx";

export default function InventoryCreateModal() {
  const navigate = useNavigate();

  async function handleSave(newItem) {
    try {
      const response = await fetch("http://127.0.0.1:8000/inventory/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newItem,
          quantity: String(newItem.quantity),
        }),
      });

      if (!response.ok) throw new Error("Kan item niet toevoegen");

      const responseData = await response.json();
      const newId = responseData.item?.id;

      if (!newId) throw new Error("Ontbrekende ID in API respons");


      navigate(`/dashboard/inventory/${newId}`);
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
      <div className="fixed bg-white shadow-lg p-6 rounded-t-2xl sm:rounded-l-2xl 
        w-[100%] sm:w-[40%] h-[90vh] sm:h-screen bottom-0 sm:top-1/2 sm:right-0 sm:-translate-y-1/2 transition-transform duration-300 ease-in-out"
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={() => navigate("/dashboard")}
        >
          <FaTimes size={24} />
        </button>

        <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Nieuw Product</h2>

        <InventoryForm onSave={handleSave} onCancel={() => navigate("/dashboard")} />
      </div>
    </div>
  );
}