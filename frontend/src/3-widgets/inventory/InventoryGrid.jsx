import { useEffect, useState } from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import InventoryCard from "../../5-entities/inventory/ui/InventoryCard";

export default function InventoryGrid() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 18;

  useEffect(() => {
    async function fetchInventory() {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/inventory?start=${
            (currentPage - 1) * itemsPerPage
          }&limit=${itemsPerPage}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        console.log(`Fetched inventory for page ${currentPage}:`, data);

        setInventoryItems(data.items || []);
        setTotalPages(
          Math.ceil((data.pagination?.totalItems || 1) / itemsPerPage)
        );
      } catch (error) {
        console.error(
          "Er is een fout opgetreden bij het ophalen van de inventory:",
          error
        );
      }
    }

    fetchInventory();
  }, [currentPage]);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {inventoryItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {inventoryItems.map((item) => (
            <InventoryCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <h1 className="text-lg sm:text-xl font-semibold text-center text-gray-600">
          Loading...
        </h1>
      )}

      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center mt-8 gap-2 sm:gap-4">
          {currentPage > 1 && (
            <button
              className="px-3 py-2 sm:px-5 sm:py-3 flex items-center gap-2 border rounded-lg bg-gray-200 hover:bg-gray-300 transition-all duration-300 shadow-sm text-xs sm:text-base"
              onClick={() => setCurrentPage(1)}
            >
              <FaAngleDoubleLeft className="text-sm sm:text-lg" />{" "}
              <span className="hidden sm:inline">Eerste</span>
            </button>
          )}

          <button
            className={`px-4 py-2 sm:px-5 sm:py-3 flex items-center gap-2 border rounded-lg text-xs sm:text-base ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 shadow-sm"
            }`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <FaAngleLeft className="text-sm sm:text-lg" />{" "}
            <span className="hidden sm:inline">Vorige</span>
          </button>

          <span className="px-4 py-2 sm:px-5 sm:py-3 border rounded-lg bg-gray-100 text-xs sm:text-base shadow-sm">
            {currentPage} van {totalPages}
          </span>

          <button
            className={`px-4 py-2 sm:px-5 sm:py-3 flex items-center gap-2 border rounded-lg text-xs sm:text-base ${
              currentPage >= totalPages
                ? "opacity-50 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 shadow-sm"
            }`}
            disabled={currentPage >= totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            <span className="hidden sm:inline">Volgende</span>{" "}
            <FaAngleRight className="text-sm sm:text-lg" />
          </button>

          {currentPage < totalPages && (
            <button
              className="px-3 py-2 sm:px-5 sm:py-3 flex items-center gap-2 border rounded-lg bg-gray-200 hover:bg-gray-300 transition-all duration-300 shadow-sm text-xs sm:text-base"
              onClick={() => setCurrentPage(totalPages)}
            >
              <span className="hidden sm:inline">Laatste</span>{" "}
              <FaAngleDoubleRight className="text-sm sm:text-lg" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
