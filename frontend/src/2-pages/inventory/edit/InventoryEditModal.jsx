import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import InventoryForm from "../../../5-entities/inventory/ui/InventoryForm.jsx";

export default function InventoryEditModal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    async function fetchItem() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/inventory/${id}`, {
          method: "GET",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
        });
  
        if (!response.ok) throw new Error("Kan item niet ophalen");
  
        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error("Fout bij ophalen van item:", error);
      }
    }
  
    if (id) fetchItem();
  }, [id]);

  async function handleSave(updatedItem) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/inventory/${id}`, {
        method: "PATCH",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });
  
      if (!response.ok) throw new Error("Kan item niet updaten");
  
      navigate(`/dashboard/inventory/${id}`, { state: { updatedItem } });
    } catch (error) {
      console.error("Fout bij updaten van item:", error);
    }
  }

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center sm:justify-end transition-opacity duration-300">
      <div className="absolute inset-0 backdrop-blur-lg transition-opacity duration-500" onClick={() => navigate("/dashboard")} />
      <div className="fixed bg-white shadow-lg p-6 rounded-t-2xl sm:rounded-l-2xl w-[100%] sm:w-[40%] h-[90vh] sm:h-screen bottom-0 sm:top-1/2 sm:right-0 sm:-translate-y-1/2 transition-transform duration-300 ease-in-out">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" onClick={() => navigate("/dashboard")}>
          <FaTimes size={24} />
        </button>
        <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Item Bewerken</h2>
        <InventoryForm initialData={item} onSave={handleSave} onCancel={() => navigate("/dashboard")} />
      </div>
    </div>
  );
}