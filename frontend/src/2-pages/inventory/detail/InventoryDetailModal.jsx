import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import Barcode from "../../../5-entities/inventory/barcode/Barcode";

export default function InventoryDetailModal() {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("Gevonden ID in URL:", id);
  const [item, setItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchItem() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/inventory/${id}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          signal,
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

    return () => controller.abort();
  }, [id]);

  async function handleDelete() {
    if (!window.confirm(`Weet je zeker dat je "${item.name}" wilt verwijderen?`)) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`http://127.0.0.1:8000/inventory/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Kan item niet verwijderen");

      navigate("/dashboard", { state: { deletedItemId: id } });
    } catch (error) {
      console.error("Fout bij verwijderen van item:", error);
    } finally {
      setIsDeleting(false);
    }
  }


  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center sm:justify-end transition-opacity duration-300">
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
        <div className="mt-8">
          <div className="w-full text-lg font-semibold text-black bg-yellow-400 border border-yellow-300 rounded-3xl p-3 text-center">
            {item.name}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <p className="text-gray-600">{item.description}</p>

            <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-semibold">SKU:</span> {item.sku}
              </p>
              <p>
                <span className="font-semibold">Voorraad:</span> {item.quantity}{" "}
                stuks
              </p>
              <p>
                <span className="font-semibold">Categorie:</span>{" "}
                {item.category}
              </p>
            </div>

            <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-semibold">Leverancier:</span>{" "}
                {item.supplier}
              </p>
              <p>
                <span className="font-semibold">Locatie:</span> {item.location}
              </p>
            </div>
          </div>

          <div className="border-t flex justify-center items-center py-4 bg-gray-100 rounded-b-2xl">
            <Barcode value={item.barcode} />
          </div>

          <div className="flex justify-between mt-4 gap-4">
            <Link
              key={item._id}
              to={`/dashboard/inventory/${item.id}/edit`} 
              className="cursor-pointer flex items-center gap-2 px-4 py-3 text-white bg-gray-700 hover:bg-gray-800 rounded-lg shadow transition-all w-1/2 text-center justify-center"
            >
              <FaEdit /> Aanpassen
            </Link>

            <button
            onClick={handleDelete}
            className={`flex items-center gap-2 px-4 py-3 text-gray-700 bg-red-400 rounded-lg shadow w-1/2 transition ${
              isDeleting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-500"
            }`}
            disabled={isDeleting}
          >
            <FaTrash /> {isDeleting ? "Verwijderen..." : "Verwijderen"}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
