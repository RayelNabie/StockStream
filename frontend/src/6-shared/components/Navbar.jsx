import { FaTimes } from "react-icons/fa";

export default function InventoryDetailModal({ item, isOpen, onClose }) {
  return (
    <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
      {/* ✅ Overlay zonder zwart, met vervagend effect */}
      <div
        className={`absolute inset-0 bg-white bg-opacity-40 backdrop-blur-lg transition-opacity duration-500 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      ></div>

      {/* ✅ Sidebar Modal met smooth slide-in */}
      <div
        className={`w-80 sm:w-96 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } p-6 fixed right-0 top-0 bottom-0 rounded-l-2xl`}
      >
        {/* ❌ Sluitknop */}
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" onClick={onClose}>
          <FaTimes size={24} />
        </button>

        {/* ✅ Modal Content */}
        {item ? (
          <>
            <h2 className="text-2xl font-bold mb-4">{item.name}</h2>
            <p className="text-gray-600 mb-2">{item.description}</p>
            <p className="text-sm text-gray-500">SKU: {item.sku}</p>
            <p className="text-sm text-gray-500">Categorie: {item.category}</p>
            <p className="text-sm text-gray-500">Voorraad: {item.quantity}</p>
            <p className="text-sm text-gray-500">Locatie: {item.location}</p>

            {/* 🔗 Extra Info */}
            <div className="mt-4">
              <a href={item._links?.self?.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Bekijk in API
              </a>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Laden...</p>
        )}
      </div>
    </div>
  );
}